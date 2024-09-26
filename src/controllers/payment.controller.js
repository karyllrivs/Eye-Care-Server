const { get } = require("lodash");
const {
  createPayment,
  getPaymentByUserId,
  updatePaymentById,
} = require("../models/payment.model.js");
const { randomPasswordToken } = require("../helper/index.js");
const { sendCheckoutOTP } = require("../helper/email_message.helper.js");

const getSinglePaymentByUserId = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");
    const payment = await getPaymentByUserId(user_id);

    return res.status(200).json(payment).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createPaymentOTP = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");

    const payment = await getPaymentByUserId(user_id);

    if (payment) {
      /** Send Email */
      const email = get(req, "identity.email");
      const fullName = `${get(req, "identity.first_name")} ${get(
        req,
        "identity.last_name"
      )}`;
      await sendCheckoutOTP(email, fullName, payment.otp);

      return res
        .status(200)
        .json({
          message: "Check your email to get the OTP.",
          payment,
        })
        .end();
    }

    const otp = randomPasswordToken(); // 6-DIGIT OTP
    const newPayment = await createPayment({ user_id, otp });

    /** Send Email */
    const email = get(req, "identity.email");
    const fullName = `${get(req, "identity.first_name")} ${get(
      req,
      "identity.last_name"
    )}`;
    await sendCheckoutOTP(email, fullName, otp);

    return res
      .status(200)
      .json({
        message:
          "Payment successfully created. Check your email to get the OTP.",
        newPayment,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const verifyPayment = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");
    const { otp } = req.body;
    const payment = await getPaymentByUserId(user_id);

    if (!payment)
      return res
        .status(403)
        .json({ message: "You don't have existing payment." })
        .end();

    if (payment.otp !== otp)
      return res
        .status(403)
        .json({ message: "The OTP provided is incorrect." })
        .end();

    await updatePaymentById(payment._id, { isVerified: true });

    return res
      .status(200)
      .json({ message: "The checkout orders is verified." })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

module.exports = {
  getSinglePaymentByUserId,
  createPaymentOTP,
  verifyPayment,
};
