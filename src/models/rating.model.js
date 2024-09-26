const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  review: { type: String },
  rating: { type: Number },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const RatingModel = mongoose.model("rating", RatingSchema);

const getRatings = () => RatingModel.find();
const getRatingsByProductId = (product_id) => RatingModel.find({ product_id });
const getRatingById = (id) => RatingModel.findById(id);
const createRating = (values) =>
  new RatingModel(values).save().then((v) => v.toObject());
const deleteRatingById = (id) => RatingModel.findOneAndDelete({ _id: id });
const updateRatingById = (id, values) =>
  RatingModel.findOneAndUpdate(id, values);

module.exports = {
  getRatings,
  getRatingsByProductId,
  getRatingById,
  createRating,
  deleteRatingById,
  updateRatingById,
};
