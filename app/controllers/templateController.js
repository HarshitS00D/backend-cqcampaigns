const services = require("../../services");
const { generateDataWithKeys, generateParsedQuery } = require("../../utils");

const createTemplate = async (req, res) => {
  const { body } = req;
  const response = await services.template.createTemplate(body, req.user);

  if (response.errors) {
    console.log(response);
    return res.status(500).send({ error: "Internal Server Error" });
  }
  res.send("Template Created");
};

const getTemplates = async (req, res) => {
  const query = generateParsedQuery(req.query);
  const { data, total } = await services.template.getTemplates(query, req.user);
  if (!data) return res.status(500).send("Internal Server Error");
  res.send({ data: generateDataWithKeys(data), total });
};

const deleteTemplates = async (req, res) => {
  const { templateIDs } = req.query;
  const result = await services.template.deleteTemplates(templateIDs, req.user);

  if (result.ok) {
    res.send(`${result.deletedCount} Template(s) Deleted`);
  } else res.status(500).send({ error: result.message });
};

const editTemplate = async (req, res) => {
  const { templateID } = req.params;
  if (!templateID) return res.status(400).send("templateID not provided");
  const result = await services.template.editTemplate(
    templateID,
    req.body,
    req.user
  );
  if (result.ok) {
    res.send(`Template updated`);
  } else res.status(500).send({ error: result.message });
};

module.exports = {
  createTemplate,
  getTemplates,
  deleteTemplates,
  editTemplate,
};
