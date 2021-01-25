const bcrypt = require("bcrypt");

const validators = {
  email: (str) =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      str
    ),
};

function compareCrypt(operand1, operand2) {
  return bcrypt.compare(operand1, operand2);
}

async function hashCrypt(text) {
  const salt = await bcrypt.genSalt(8);
  return bcrypt.hash(text, salt, null);
}

// (async () => {
//   const h = await hashCrypt("0");
//   console.log(h);
// })();

function generateRandomString(length) {
  const keylist =
    "abcdefghijklmnopqrstuvwxyzQRSTUVWXYZ123456789ABCDEFGHIJKLMNOP";
  let pass = "";
  for (let i = 0; i < length; i += 1) {
    pass += keylist.charAt(Math.floor(Math.random() * keylist.length));
  }
  return pass;
}

const disableRoute = (req, res) =>
  res.status(503).send("Currently Unavailable");

function generateDataWithKeys(array) {
  if (!array.length) return [];
  return array.map((el, i) => ({ ...(el._doc || el), key: i + 1 }));
}

function generateParsedQuery(query) {
  const q = {};
  Object.keys(query).forEach((el) => {
    q[el] = typeof query[el] === "string" ? JSON.parse(query[el]) : query[el];
  });
  return q;
}

const userRoles = ["SuperAdmin", "Admin", "User"];

module.exports = {
  compareCrypt,
  hashCrypt,
  generateRandomString,
  disableRoute,
  generateDataWithKeys,
  generateParsedQuery,
  validators,
  userRoles,
};
