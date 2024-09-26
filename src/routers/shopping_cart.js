const {
  getAllShoppingCarts,
  createUserShoppingCart,
  updateUserShoppingCart,
  deleteUserShoppingCart,
} = require("../controllers/shopping_cart.controller.js");

module.exports = (router) => {
  router.get("/shopping_carts/:user_id", getAllShoppingCarts);
  router.post("/shopping_carts", createUserShoppingCart);
  router.put("/shopping_carts/:user_id", updateUserShoppingCart);
  router.delete("/shopping_carts/:user_id", deleteUserShoppingCart);
};
