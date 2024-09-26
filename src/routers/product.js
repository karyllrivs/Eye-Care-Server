const {
  getAllProducts,
  getSingleProduct,
  createSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getSearchProducts,
} = require("../controllers/product.controller.js");
const { upload } = require("../helper/file_uploader.js");

module.exports = (router) => {
  router.get("/products", getAllProducts);
  router.get("/products-search/:keyword", getSearchProducts);
  router.get("/products/:product_id", getSingleProduct);
  router.post("/products", upload.single("image"), createSingleProduct);
  router.put(
    "/products/:product_id",
    upload.single("image"),
    updateSingleProduct
  );
  router.delete("/products/:product_id", deleteSingleProduct);
};
