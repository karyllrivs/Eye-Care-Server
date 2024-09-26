const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  image: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  address: { type: String },
  email: { type: String },
  mobile_number: { type: String },
});

const ProfileModel = mongoose.model("profile", ProfileSchema);

const getProfiles = () => ProfileModel.find();
const getProfileByEmail = (email) => ProfileModel.findOne({ email });
const getProfileByUserId = (user_id) => ProfileModel.findOne({ user_id });
const createProfile = (values) =>
  new ProfileModel(values).save().then((v) => v.toObject());
const deleteProfileByUserId = (user_id) =>
  ProfileModel.findOneAndDelete({ user_id });
const updateProfileByUserId = (user_id, values) =>
  ProfileModel.findOneAndUpdate({ user_id }, values);

module.exports = {
  getProfiles,
  getProfileByEmail,
  getProfileByUserId,
  createProfile,
  deleteProfileByUserId,
  updateProfileByUserId,
};
