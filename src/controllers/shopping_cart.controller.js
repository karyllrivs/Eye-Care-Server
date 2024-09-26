const {
  getShoppingCartsByUserId,
  createShoppingCart,
  deleteShoppingCartByUserId,
  updateShoppingCartByUserId,
} = require("../models/shopping_cart.model.js");

const getAllShoppingCarts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const shopping_cart = await getShoppingCartsByUserId(user_id);

    return res.status(200).json(shopping_cart).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createUserShoppingCart = async (req, res) => {
  try {
    const { user_id, product_name, category, price } = req.body;

    const shopping_cart = await createShoppingCart({
      user_id,
      product_name,
      category,
      price,
    });

    return res
      .status(200)
      .json({
        message: "Shopping Cart successfully created.",
        shopping_cart,
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

const updateUserShoppingCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { product_name, category, price } = req.body;

    const shopping_cart = await updateShoppingCartByUserId(user_id, {
      user_id,
      product_name,
      category,
      price,
    });

    if (!shopping_cart)
      return res
        .status(404)
        .json({ message: "Shopping Cart not found." })
        .end();

    return res
      .status(200)
      .json({
        message: "Shopping Cart successfully updated.",
        shopping_cart,
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

const deleteUserShoppingCart = async (req, res) => {
  try {
    const { user_id } = req.params;

    await deleteShoppingCartByUserId(user_id);

    return res
      .status(200)
      .json({ message: "ShoppingCart successfully deleted." })
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
  getAllShoppingCarts,
  createUserShoppingCart,
  updateUserShoppingCart,
  deleteUserShoppingCart,
};
