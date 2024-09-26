const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  isInNavbar: { type: Boolean, default: false },
});

const CategoryModel = mongoose.model("category", CategorySchema);

const getCategories = () => CategoryModel.find();
const getCategoryById = (id) => CategoryModel.findById(id);
const createCategory = (values) =>
  new CategoryModel(values).save().then((v) => v.toObject());
const deleteCategoryById = (id) => CategoryModel.findOneAndDelete({ _id: id });
const updateCategoryById = (id, values) =>
  CategoryModel.findByIdAndUpdate(id, values);

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  deleteCategoryById,
  updateCategoryById,
};
