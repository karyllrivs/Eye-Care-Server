const {
  getAllCategories,
  getSingleCategory,
  createSingleCategory,
  updateSingleCategory,
  deleteSingleCategory,
} = require("../controllers/category.controller.js");

module.exports = (router) => {
  router.get("/categories", getAllCategories);
  router.get("/categories/:category_id", getSingleCategory);
  router.post("/categories", createSingleCategory);
  router.put("/categories/:category_id", updateSingleCategory);
  router.delete("/categories/:category_id", deleteSingleCategory);
};
