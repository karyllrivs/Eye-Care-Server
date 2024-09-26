const { get } = require("lodash");
const {
  getRatingsByProductId,
  createRating,
} = require("../models/rating.model.js");

const getRatingsOfProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const ratings = await getRatingsByProductId(product_id);

    return res.status(200).json(ratings).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createProductRating = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");
    const { product_id, review, rating } = req.body;

    const newRating = await createRating({
      user_id,
      product_id,
      review,
      rating,
    });

    return res
      .status(200)
      .json({ message: "Rating successfully created.", newRating })
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
  getRatingsOfProduct,
  createProductRating,
};
