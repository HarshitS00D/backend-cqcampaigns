const services = require("../../services");
const _ = require("lodash");
const { generateDataWithKeys, generateParsedQuery } = require("../../utils");

const deleteSubscribers = async (req, res) => {
  const { subIDs, listID } = req.query;
  const result = await services.subscriber.deleteSubscribers(subIDs, listID);
  if (!result.errors) return res.send("Subscriber(s) successfully deleted");
  res.status(500).send("Internal Server Error");
};

const getListSubscribers = async (req, res) => {
  const { listID } = req.params;
  if (!listID) return res.status(400).send("listID not provided");
  const query = generateParsedQuery(req.query);
  const { data, total } = await services.subscriber.getSubscribers(
    listID,
    query
  );
  if (!data) return res.status(500).send("Internal Server Error");
  res.send({ data: generateDataWithKeys(data), total });
};

const downloadSubscribersList = async (req, res) => {
  const { listID } = req.params;
  const query = generateParsedQuery(req.query);
  const { data } = await services.subscriber.getSubscribers(listID, query);
  const subscribers = data.map((el) => el._doc);

  const { csv } = services.file.createCSVfromJson(subscribers);
  if (!csv) return res.status(500).send("Internal Server Error");

  const list = await services.list.getListDetailsById(listID);

  res.send({ csv, listname: list.name });
};

const unsubscribe = async (req, res) => {
  const { _id } = req.params;
  const response = await services.subscriber.editSubscriber(
    { _id },
    { subscribed: false }
  );
  if (response.error) return res.status(500).send("Internal Server Error");
  res.send("Unsubscribed Successfully");
};

module.exports = {
  deleteSubscribers,
  getListSubscribers,
  downloadSubscribersList,
  unsubscribe,
};
