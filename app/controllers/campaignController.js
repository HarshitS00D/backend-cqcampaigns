const services = require("../../services");
const { generateDataWithKeys, generateParsedQuery } = require("../../utils");

const createCampaign = async (req, res) => {
  const { body } = req;

  const response = await services.campaign.createCampaign(body, req.user);

  if (response.errors) {
    console.log(response);
    return res.status(500).send({ error: "Internal Server Error" });
  }
  res.send("Campaign Created");
};

const deleteCampaigns = async (req, res) => {
  const { campaignIDs } = req.query;
  const result = await services.campaign.deleteCampaigns(campaignIDs, req.user);

  if (result.ok) {
    res.send(`${result.deletedCount} Campaign(s) Deleted`);
  } else res.status(500).send({ error: result.message });
};

const getCampaigns = async (req, res) => {
  const query = generateParsedQuery(req.query);
  const { data, total } = await services.campaign.getCampaigns(query, req.user);
  if (!data) return res.status(500).send("Internal Server Error");
  res.send({ data: generateDataWithKeys(data), total });
};

module.exports = {
  createCampaign,
  deleteCampaigns,
  getCampaigns,
};
