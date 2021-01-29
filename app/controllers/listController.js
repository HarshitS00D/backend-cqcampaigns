const services = require("../../services");
const _ = require("lodash");
const {
  generateDataWithKeys,
  generateParsedQuery,
  validators,
} = require("../../utils");

const readList = async (req, res) => {
  const { file } = req;
  if (!file) return res.send("No file found");

  let csvData = await services.file.readCSV(file.filename);

  if (!Array.isArray(csvData)) return res.send(csvData);
  if (csvData.length < 1) return res.send("No data available");
  res.send(generateDataWithKeys(csvData));
};

const createList = async (req, res) => {
  const {
    body: { listName, data },
  } = req;
  if (!listName)
    return res.status(406).send({ error: "List name not provided" });
  if (data.length < 1) return res.status(406).send({ error: "Empty Data" });

  const faultyRecords = [];
  const validatedRecords = [];

  for (list of data)
    (validators.email(list.email) ? validatedRecords : faultyRecords).push(
      _.omit(list, "key")
    );

  if (validatedRecords.length < 1)
    return res.status(406).send({ error: "No Valid Record Present" });

  const response = await services.list.createListFromJson(
    listName,
    validatedRecords,
    req.user
  );
  if (response.errors) {
    console.log(response);
    return res.status(500).send({ error: "Internal Server Error" });
  }
  res.send({
    success: `${validatedRecords.length} records created`,
    faultyRecords,
  });
};

const deleteLists = async (req, res) => {
  const result = await services.list.deleteLists(req.query.listIDs, req.user);
  if (result.list && result.subs) return res.send("List(s) Deleted");
  res.status(500).send({ error: "Internal Server Error" });
};

const updateList = async (req, res) => {
  const { _id, update } = req.body;

  if (update.$push && update.$push.subscribers) {
    //to update subscribers in list

    const faultyRecords = [];
    const validatedRecords = [];

    for (subscriber of update.$push.subscribers)
      (validators.email(subscriber.email)
        ? validatedRecords
        : faultyRecords
      ).push({ ..._.omit(subscriber, "key"), listID: _id });

    if (validatedRecords.length < 1)
      return res.status(406).send({ error: "No Valid Record Present" });

    update.$push.subscribers = validatedRecords;

    const result = await services.list.updateList(_id, update, req.user);

    if (result.code && result.code === 11000)
      return res.send({ warn: "List Updated (duplicate emails skipped)" });

    if (!result.ok)
      return res.status(500).send({ error: "Internal Server Error" });
    res.send({ success: "List Updated", faultyRecords });
  } else if (update.$set && update.$set.name) {
    // to update list name
    const result = await services.list.updateList(_id, update, req.user);

    if (!result.ok) res.status(500).send({ error: "Internal Server Error" });
    else res.send("List Name Updated");
  }
};

const getUserLists = async (req, res) => {
  const query = generateParsedQuery(req.query);
  let { data, total } = await services.list.getUserLists(req.user._id, query);
  if (!data) return res.status(500).send("Internal Server Error");
  res.send({ data: generateDataWithKeys(data), total });
};

module.exports = {
  readList,
  createList,
  deleteLists,
  updateList,
  getUserLists,
};
