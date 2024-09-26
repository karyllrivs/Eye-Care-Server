const { getCurrentDate } = require("./date");

const { SERVER_URL } = process.env;

const createLineItems = (cartItems) => {
  return cartItems.map((cartItem) => {
    const { price, quantity, description, name, image } = cartItem;
    return {
      currency: "PHP",
      amount: price * 100,
      description,
      name,
      quantity,
      images: [`${SERVER_URL}/api/file/${image}`],
    };
  });
};

const createOrderItems = (cartItems, user_id, checkout_id) => {
  return cartItems.map((cartItem) => {
    const { price, quantity, _id, image } = cartItem;
    return {
      user_id,
      product_id: _id,
      image: image,
      delivered_on: getCurrentDate(),
      status: "Pending",
      quantity,
      total: quantity * price,
      checkout_id,
    };
  });
};

module.exports = {
  createLineItems,
  createOrderItems,
};
