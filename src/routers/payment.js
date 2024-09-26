const {
  createPaymentOTP,
  verifyPayment,
  getSinglePaymentByUserId,
} = require("../controllers/payment.controller.js");
const { isAuthenticated } = require("../middleware/index.js");

module.exports = (router) => {
  router.get("/own-payment", isAuthenticated, getSinglePaymentByUserId);
  router.post("/own-payment", isAuthenticated, getSinglePaymentByUserId); // For flutter
  router.post("/payment", isAuthenticated, createPaymentOTP);
  router.post("/verify-payment", isAuthenticated, verifyPayment);
};
