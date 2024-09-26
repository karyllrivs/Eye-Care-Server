const {
  getAllProfiles,
  getProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/profile.controller.js");
const { upload } = require("../helper/file_uploader.js");
const { isAuthenticated, isOwner } = require("../middleware/index.js");

module.exports = (router) => {
  router.get("/profiles", getAllProfiles);
  router.get("/profiles/:user_id", getProfile);
  router.post("/profiles", isAuthenticated, createUserProfile);
  router.put(
    "/profiles/:user_id",
    isAuthenticated,
    isOwner,
    upload.single("image"),
    updateUserProfile
  );
  router.delete(
    "/profiles/:user_id",
    isAuthenticated,
    isOwner,
    deleteUserProfile
  );
};
