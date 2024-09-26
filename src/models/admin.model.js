const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

const AdminModel = mongoose.model("admin", AdminSchema);

const getAdmins = () => AdminModel.find();
const getAdminByUsername = (username) => AdminModel.findOne({ username });
const getAdminBySessionToken = (sessionToken) =>
  AdminModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
const getAdminById = (id) => AdminModel.findById(id);
const createAdmin = (values) =>
  new AdminModel(values).save().then((v) => v.toObject());
const deleteAdminById = (id) => AdminModel.findOneAndDelete({ _id: id });
const updateAdminById = (id, values) => AdminModel.findOneAndUpdate(id, values);

module.exports = {
  getAdmins,
  getAdminByUsername,
  getAdminBySessionToken,
  getAdminById,
  createAdmin,
  deleteAdminById,
  updateAdminById,
};
