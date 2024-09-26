const {
  getAllConsultations,
  getUserConsultations,
  createUserConsultation,
  updateConsultation,
  deleteConsultation,
  getAllArchivedConsultations,
  restoreArchivedConsultation,
} = require("../controllers/consultation.controller.js");
const { isAuthenticated } = require("../middleware/index.js");

module.exports = (router) => {
  router.get("/consultations", getAllConsultations);
  router.get("/consultations/archive", getAllArchivedConsultations);
  router.put("/consultations/restore/:id", restoreArchivedConsultation);
  router.get("/consultations/:user_id", getUserConsultations);
  router.post("/consultations", isAuthenticated, createUserConsultation);
  router.put("/consultations/:id", updateConsultation);
  router.delete("/consultations/:id", deleteConsultation);
};
