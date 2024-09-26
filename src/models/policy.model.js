const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema({
  name: { type: String },
  content: { type: String },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const PolicyModel = mongoose.model("policy", PolicySchema);

const getPolicies = () => PolicyModel.find();
const getPolicyById = (id) => PolicyModel.findById(id);
const createPolicy = (values) =>
  new PolicyModel(values).save().then((v) => v.toObject());
const deletePolicyById = (id) => PolicyModel.findOneAndDelete({ _id: id });
const updatePolicyById = (id, values) =>
  PolicyModel.findByIdAndUpdate(id, values);

module.exports = {
  getPolicies,
  getPolicyById,
  createPolicy,
  deletePolicyById,
  updatePolicyById,
};
