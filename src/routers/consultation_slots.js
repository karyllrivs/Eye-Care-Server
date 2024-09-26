const {
  getAllConsultationSlots,
  createSingleConsultationSlot,
  deleteSingleConsultationSlot,
  getAllAvailableConsultationSlots,
} = require("../controllers/consultation_slot.controller");

module.exports = (router) => {
  router.get("/consultation-slots", getAllConsultationSlots);
  router.get("/consultation-available-slots", getAllAvailableConsultationSlots);
  router.post("/consultation-slots", createSingleConsultationSlot);
  router.delete("/consultation-slot/:id", deleteSingleConsultationSlot);
};
