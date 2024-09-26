const { get } = require("lodash");
const {
  createLineItems,
  createOrderItems,
} = require("../helper/checkout_items");
const { checkoutAPI } = require("../helper/paymongo.helper");
const { createOrders } = require("../models/order.model");
const { deletePaymentByUserId } = require("../models/payment.model");

const checkoutItems = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");

    const { cartItems } = req.body;

    const line_items = createLineItems(cartItems);

    const checkoutData = await checkoutAPI(line_items);

    if (!checkoutData.errors) {
      const checkout_id = checkoutData.data.id;
      const newOrders = createOrderItems(cartItems, user_id, checkout_id);
      const orders = await createOrders(newOrders);

      await deletePaymentByUserId(user_id);

      return res
        .status(200)
        .json({
          orders,
          checkoutUrl: checkoutData.data.attributes.checkout_url,
        })
        .end();
    }

    return res
      .status(400)
      .json({
        errors: checkoutData.errors,
        message: "An error occured while processing the payments.",
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

module.exports = {
  checkoutItems,
};
