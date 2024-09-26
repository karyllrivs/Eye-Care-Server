const {
  adminRegister,
  adminLogin,
} = require("../controllers/admin_authentication.controller.js");

module.exports = (router) => {
  router.post("/admin-register", adminRegister);
  router.post("/admin-login", adminLogin);
};
