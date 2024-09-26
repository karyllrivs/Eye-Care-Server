const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  image: { type: String },
  delivered_on: { type: String },
  status: { type: String },
  quantity: { type: Number },
  total: { type: Number },
  checkout_id: { type: String },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const OrderModel = mongoose.model("order", OrderSchema);

const getOrders = () => OrderModel.find();
const getOrdersGroupByCheckoutId = () =>
  OrderModel.aggregate([
    {
      $group: {
        _id: {
          user_id: "$user_id",
          checkout_id: "$checkout_id",
          date_created: "$date_created",
        },
        total_amount: { $sum: "$total" },
        orders: { $push: "$$ROOT" },
      },
    },
  ]);
const getOrdersByCheckoutId = (checkout_id) => OrderModel.find({ checkout_id });
const getOrderById = (id) => OrderModel.findById(id);
const getOrderByUserId = (user_id) => OrderModel.find({ user_id });
const createOrder = (values) =>
  new OrderModel(values).save().then((v) => v.toObject());
const createOrders = (values) => OrderModel.insertMany(values);
const deleteOrderByUserId = (user_id) =>
  OrderModel.findOneAndDelete({ user_id });
const updateOrderByUserId = (user_id, values) =>
  OrderModel.findOneAndUpdate({ user_id }, values);
const updateOrderById = (id, values) =>
  OrderModel.findByIdAndUpdate(id, values);
const updateOrderByProductId = (product_id, values) =>
  OrderModel.findOneAndUpdate({ product_id }, values);
const deleteOrderById = (id) => OrderModel.findByIdAndDelete(id);

module.exports = {
  OrderModel,
  getOrders,
  getOrdersGroupByCheckoutId,
  getOrdersByCheckoutId,
  getOrderById,
  getOrderByUserId,
  createOrder,
  createOrders,
  deleteOrderByUserId,
  updateOrderByUserId,
  updateOrderById,
  updateOrderByProductId,
  deleteOrderById,
};
