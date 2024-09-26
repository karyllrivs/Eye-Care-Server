const {
  getAllPatients,
  createSinglePatient,
  updatePatientLens,
  updatePatient,
  deletePatient,
} = require("../controllers/patient.controller");

module.exports = (router) => {
  router.get("/patients", getAllPatients);
  router.post("/patients", createSinglePatient);
  router.put("/patient-lens", updatePatientLens);
  router.put("/patients/:id", updatePatient);
  router.delete("/patients/:id", deletePatient);
};
