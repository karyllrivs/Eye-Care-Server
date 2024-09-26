const mongoose = require("mongoose");

const ShoppingCartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  product_name: { type: String },
  category: { type: String },
  price: { type: String },
});

const ShoppingCartModel = mongoose.model("shopping_cart", ShoppingCartSchema);

const getShoppingCartsByUserId = (user_id) =>
  ShoppingCartModel.find({ user_id });
const getShoppingCartById = (id) => ShoppingCartModel.findById(id);
const createShoppingCart = (values) =>
  new ShoppingCartModel(values).save().then((v) => v.toObject());
const deleteShoppingCartByUserId = (user_id) =>
  ShoppingCartModel.findOneAndDelete({ user_id });
const updateShoppingCartByUserId = (user_id, values) =>
  ShoppingCartModel.findOneAndUpdate({ user_id }, values);

module.exports = {
  getShoppingCartsByUserId,
  getShoppingCartById,
  createShoppingCart,
  deleteShoppingCartByUserId,
  updateShoppingCartByUserId,
};
