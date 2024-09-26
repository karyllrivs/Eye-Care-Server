const { checkoutItems } = require("../controllers/paymongo.controller.js");
const { isAuthenticated } = require("../middleware/index.js");

module.exports = (router) => {
  router.post("/paymongo/checkout", isAuthenticated, checkoutItems);
};
