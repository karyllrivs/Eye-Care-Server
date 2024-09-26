const {
  register,
  login,
  createTokenForPasswordReset,
  confirmTokenAndChangePassword,
  verifyAccount,
  logout,
} = require("../controllers/authentication.controller.js");
const { isAuthenticated } = require("../middleware/index.js");

module.exports = (router) => {
  router.post("/register", register);
  router.post("/verify-account", verifyAccount);
  router.post("/login", login);
  router.post("/password-reset", createTokenForPasswordReset);
  router.post("/password-token", confirmTokenAndChangePassword);
  router.delete("/logout", isAuthenticated, logout);
};
