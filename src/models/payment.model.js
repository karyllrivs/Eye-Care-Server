const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  otp: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const PaymentModel = mongoose.model("payment", PaymentSchema);

const getPayments = () => PaymentModel.find();
const getPaymentById = (id) => PaymentModel.findById(id);
const getPaymentByUserId = (user_id) => PaymentModel.findOne({ user_id });
const createPayment = (values) =>
  new PaymentModel(values).save().then((v) => v.toObject());
const deletePaymentByUserId = (user_id) =>
  PaymentModel.findOneAndDelete({ user_id });
const updatePaymentById = (id, values) =>
  PaymentModel.findByIdAndUpdate(id, values);

module.exports = {
  getPayments,
  getPaymentByUserId,
  getPaymentById,
  createPayment,
  deletePaymentByUserId,
  updatePaymentById,
};
