const {
  googleInitialize,
  googleLogin,
  googleRegister,
} = require("../controllers/google_authentication.controller");

module.exports = (router) => {
  router.post("/auth-google", googleInitialize);
  router.get("/auth-google/login/:email", googleLogin);
  router.get("/auth-google/register/:email", googleRegister);
};
