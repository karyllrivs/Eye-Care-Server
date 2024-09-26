const {
  getAllObjectByProductId,
  createObject,
  getAllObjects,
  deleteObject,
} = require("../controllers/three_d_object.controller");
const { upload } = require("../helper/file_uploader");

module.exports = (router) => {
  router.get("/objects", getAllObjects);
  router.get("/objects/:product_id", getAllObjectByProductId);
  router.post("/objects/:product_id", upload.single("image"), createObject);
  router.post("/objects/:product_id", upload.single("image"), createObject);
  router.delete("/objects/:object_id", deleteObject);
};
