const {
  getAllPolicies,
  createSinglePolicy,
} = require("../controllers/policy.controller.js");

module.exports = (router) => {
  router.get("/policies", getAllPolicies);
  router.post("/policies", createSinglePolicy);
};
