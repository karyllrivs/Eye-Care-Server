const {
  deletePersonnel,
  getAllPersonnelByRole,
  createPersonnelAccount,
  loginPersonnelAccount,
  updatePersonnelAccount,
  getAllPersonnels,
} = require("../controllers/personnel.controller.js");
const { upload } = require("../helper/file_uploader.js");

module.exports = (router) => {
  router.get("/personnels", getAllPersonnels);
  router.post("/personnel", upload.single("image"), createPersonnelAccount);
  router.post("/personnel-login", loginPersonnelAccount);
  router.put(
    "/personnel/:personnel_id",
    upload.single("image"),
    updatePersonnelAccount
  );
  router.get("/personnel/:role", getAllPersonnelByRole);
  router.delete("/personnel/:id", deletePersonnel);
};
