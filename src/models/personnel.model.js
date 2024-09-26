const mongoose = require("mongoose");

const PersonnelSchema = new mongoose.Schema({
  username: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  profile: {
    image: { type: String, required: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    birthday: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
  },
  role: {
    type: String,
    enum: ["super_admin", "doctor", "staff"],
    default: "staff",
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const PersonnelModel = mongoose.model("personnel", PersonnelSchema);

const getPersonnels = () => PersonnelModel.find();
const getPersonnelByUsername = (username) =>
  PersonnelModel.findOne({ username });
const getPersonnelsByRole = (role) => PersonnelModel.find({ role });
const getPersonnelBySessionToken = (sessionToken) =>
  PersonnelModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
const getPersonnelById = (id) => PersonnelModel.findById(id);
const createPersonnel = (values) =>
  new PersonnelModel(values).save().then((v) => v.toObject());
const deletePersonnelById = (id) => PersonnelModel.findByIdAndDelete(id);
const updatePersonnelById = (id, values) =>
  PersonnelModel.findByIdAndUpdate(id, values);

module.exports = {
  getPersonnels,
  getPersonnelByUsername,
  getPersonnelsByRole,
  getPersonnelBySessionToken,
  getPersonnelById,
  createPersonnel,
  deletePersonnelById,
  updatePersonnelById,
};
