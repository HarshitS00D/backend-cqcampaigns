const services = require("../../services");
const {
  validators,
  generateParsedQuery,
  generateDataWithKeys,
} = require("../../utils");

const createUser = async (req, res) => {
  const payload = req.body;
  if (req.user.role > 1)
    return res.status(401).json({ error: "Unauthorized action" });
  if (!validators.email(payload.email))
    return res.status(400).json({ field: "email", error: "Invalid Email" });

  const response = await services.user.createUser(payload, req.user);

  if (response.error) {
    if (response.error.email)
      return res.status(409).json({
        field: "email",
        error: "Account already exists with this email",
      });
    return res.status(500).send({ error: "Internal Server Error" });
  }

  res.send("User Created");
};

const deleteUsers = async (req, res) => {
  const { emails } = req.query;
  if (req.user.role > 1)
    return res.status(401).send({ error: "Unauthorized action" });
  if (!emails || !emails.length)
    return res.status(402).send({ error: "Nothing to delete" });

  const response = await services.user.deleteUsers(emails, req.user);
  if (response.error)
    return res.status(500).send({ error: "Internal Server Error" });

  if (!response.deletedCount)
    return res.status(404).send({ error: "User not present" });

  res.send("User(s) Deleted");
};

const getUsers = async (req, res) => {
  if (req.user.role !== 0)
    return res.status(401).send({ error: "Unauthorized action" });

  const query = generateParsedQuery(req.query);

  const { data, total } = await services.user.getUsers(query);

  if (!data) return res.status(500).send("Internal Server Error");
  res.send({ data: generateDataWithKeys(data), total });
};

const editUser = async (req, res) => {
  const { userID } = req.params;
  if (!userID) return res.status(400).send("userID not provided");
  if (req.user.role !== 0)
    return res.status(401).send({ error: "Unauthorized action" });

  const result = await services.user.editUser(userID, req.body, req.user);

  if (result.ok) {
    res.send("User Details Updated");
  } else res.status(500).send({ error: result.message });
};

module.exports = {
  createUser,
  deleteUsers,
  getUsers,
  editUser,
};
