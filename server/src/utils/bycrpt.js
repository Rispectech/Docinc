const bycrpt = require("bcrypt");

const generateHash = async (value) => {
  const saltRounds = 10;
  return bycrpt.hashSync(value, saltRounds);
};

const compareHash = async (value, hash) => {
  console.log(value, hash);
  return bycrpt.compareSync(value, hash);
};

module.exports = {
  generateHash,
  compareHash,
};
