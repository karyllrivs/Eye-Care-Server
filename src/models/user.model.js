const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: String,
});

const UserModel = mongoose.model("user", UserSchema);

const getUsers = () => UserModel.find();
const getUserByEmail = (email) => UserModel.findOne({ email });
const getUserByVerificationToken = (token) =>
  UserModel.findOne({ verificationToken: token });
const getUserByPasswordResetToken = (token) =>
  UserModel.findOne({ passwordResetToken: token });
const getUserBySessionToken = (sessionToken) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
const getUserById = (id) => UserModel.findById(id);
const createUser = (values) =>
  new UserModel(values).save().then((v) => v.toObject());
const deleteUserById = (id) => UserModel.findOneAndDelete({ _id: id });
const updateUserById = (id, values) => UserModel.findOneAndUpdate(id, values);

module.exports = {
  UserModel,
  getUsers,
  getUserByEmail,
  getUserByVerificationToken,
  getUserByPasswordResetToken,
  getUserBySessionToken,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
};
