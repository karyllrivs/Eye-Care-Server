const mongoose = require("mongoose");

const ThreeDObjectSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  image: { type: String },
});

const ThreeDObjectModel = mongoose.model("three_d_object", ThreeDObjectSchema);

const getThreeDObjects = () => ThreeDObjectModel.find();
const getThreeDObjectById = (id) => ThreeDObjectModel.findById(id);
const getThreeDObjectByProductId = (product_id) =>
  ThreeDObjectModel.find({ product_id });
const createThreeDObject = (values) =>
  new ThreeDObjectModel(values).save().then((v) => v.toObject());
const deleteThreeDObjectById = (id) =>
  ThreeDObjectModel.findOneAndDelete({ _id: id });
const updateThreeDObjectById = (id, values) =>
  ThreeDObjectModel.findByIdAndUpdate(id, values);

module.exports = {
  getThreeDObjects,
  getThreeDObjectById,
  getThreeDObjectByProductId,
  createThreeDObject,
  deleteThreeDObjectById,
  updateThreeDObjectById,
};
