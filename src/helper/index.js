const crypto = require("crypto");
const { config } = require("dotenv");

config();

const secret = process.env.SECRET_KEY;

const random = () => crypto.randomBytes(128).toString("base64");

const randomVerificationToken = () => {
  const initialText = random();
  return initialText.substring(0, 25);
};

const randomPasswordToken = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const authentication = (salt, password) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(secret)
    .digest("hex");
};

module.exports = {
  random,
  authentication,
  randomVerificationToken,
  randomPasswordToken,
};
