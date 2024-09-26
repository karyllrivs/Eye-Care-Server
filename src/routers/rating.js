const {
  getRatingsOfProduct,
  createProductRating,
} = require("../controllers/rating.controller.js");
const { isAuthenticated } = require("../middleware/index.js");

module.exports = (router) => {
  router.get("/ratings/:product_id", getRatingsOfProduct);
  router.post("/ratings", isAuthenticated, createProductRating);
};
