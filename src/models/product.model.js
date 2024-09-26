const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  category_name: { type: String },
  name: { type: String },
  image: { type: String },
  description: { type: String },
  price: { type: Number },
  stock: { type: Number },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel = mongoose.model("product", ProductSchema);

const getProducts = () => ProductModel.find();
const searchProduct = (keyword) =>
  ProductModel.find({ name: { $regex: keyword, $options: "i" } });
const getProductsByCategoryId = (category_id) =>
  ProductModel.find({ category_id });
const getProductById = (id) => ProductModel.findById(id);
const createProduct = (values) =>
  new ProductModel(values).save().then((v) => v.toObject());
const deleteProductById = (id) => ProductModel.findOneAndDelete({ _id: id });
const updateProductById = (id, values) =>
  ProductModel.findByIdAndUpdate(id, values);

module.exports = {
  getProducts,
  searchProduct,
  getProductsByCategoryId,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,
};
