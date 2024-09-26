const {
  getOrdersByUser,
  createUserOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getAllOrdersByCheckoutId,
  getAllOrdersGroupByCheckoutId,
} = require("../controllers/order.controller.js");
const { isAuthenticated } = require("../middleware/index.js");

module.exports = (router) => {
  router.get("/orders", getAllOrders);
  router.get("/orders/:user_id", getOrdersByUser);
  router.post("/orders", isAuthenticated, createUserOrder);
  router.get("/orders-checkouts", getAllOrdersGroupByCheckoutId);
  router.get("/orders-checkout/:checkout_id", getAllOrdersByCheckoutId);
  router.put("/orders/:id", updateOrder);
  router.delete("/orders/:id", deleteOrder);
};
