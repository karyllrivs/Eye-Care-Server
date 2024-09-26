const { get } = require("lodash");
const {
  getOrderByUserId,
  createOrder,
  getOrders,
  updateOrderById,
  deleteOrderById,
  getOrdersByCheckoutId,
  getOrdersGroupByCheckoutId,
} = require("../models/order.model.js");
const { getProductById } = require("../models/product.model.js");
const { getUserById } = require("../models/user.model.js");
const { getCheckoutSession } = require("../helper/paymongo.helper.js");

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await getOrders();

    const orders = await Promise.all(
      allOrders.map(async (order) => {
        const product = await getProductById(order.product_id);
        const user = await getUserById(order.user_id);
        const checkout = await getCheckoutSession(order.checkout_id);

        let payment_status = "";
        try {
          payment_status =
            checkout.data.attributes.payments[0].attributes.status;
        } catch (e) {
          payment_status = "cancelled";
        }
        return {
          order,
          product,
          user,
          payment_status,
        };
      })
    );

    return res.status(200).json(orders).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const processProductIdOnOrders = async (initialOrders) => {
  const orders = await Promise.all(
    initialOrders.map(async (o) => {
      const p = await getProductById(o.product_id);
      return {
        ...o,
        product: p,
      };
    })
  );

  return orders;
};

const getAllOrdersGroupByCheckoutId = async (req, res) => {
  try {
    const initialCheckouts = await getOrdersGroupByCheckoutId();

    const checkouts = await Promise.all(
      initialCheckouts.map(async (c) => {
        const user = await getUserById(c._id.user_id);
        const checkout = await getCheckoutSession(c._id.checkout_id);

        let payment_status = "";
        try {
          payment_status =
            checkout.data.attributes.payments[0].attributes.status;
        } catch (e) {
          payment_status = "cancelled";
        }

        const orders = await processProductIdOnOrders(c.orders);

        return {
          checkout_id: c._id.checkout_id,
          user,
          orders,
          payment_status,
          total_amount: c.total_amount,
          date_created: c._id.date_created,
        };
      })
    );

    return res.status(200).json(checkouts).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const orders = await getOrderByUserId(user_id);

    return res.status(200).json(orders).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getAllOrdersByCheckoutId = async (req, res) => {
  try {
    const { checkout_id } = req.params;
    const orders = await getOrdersByCheckoutId(checkout_id);
    return res.status(200).json(orders).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createUserOrder = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");
    const { product_id, image, delivered_on, status, quantity, total } =
      req.body;

    const order = await createOrder({
      user_id,
      product_id,
      image,
      delivered_on,
      status,
      quantity,
      total,
    });

    return res
      .status(200)
      .json({ message: "Order successfully created.", order })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const consultation = await updateOrderById(id, {
      status,
    });

    if (!consultation)
      return res.status(404).json({ message: "Order not found." }).end();

    return res
      .status(200)
      .json({
        message: "Order successfully updated.",
        consultation,
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

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteOrderById(id);

    return res
      .status(200)
      .json({ message: "Order successfully deleted." })
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
  getAllOrders,
  getAllOrdersGroupByCheckoutId,
  getAllOrdersByCheckoutId,
  getOrdersByUser,
  createUserOrder,
  updateOrder,
  deleteOrder,
};
