const {
  getConsultationSlots,
  getConsultationSlotByDateTime,
  createConsultationSlot,
  deleteConsultationSlotById,
  getAvailableConsultationSlots,
} = require("../models/consultation_slot.model");

const getAllConsultationSlots = async (req, res) => {
  try {
    const slots = await getConsultationSlots();
    return res.status(200).json(slots).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getAllAvailableConsultationSlots = async (req, res) => {
  try {
    const slots = await getAvailableConsultationSlots();
    return res.status(200).json(slots).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createSingleConsultationSlot = async (req, res) => {
  try {
    const { date, time } = req.body;

    const existingSlot = await getConsultationSlotByDateTime(date, time);

    if (existingSlot)
      return res
        .status(403)
        .json({ message: "The slot is already existing." })
        .end();

    const slot = await createConsultationSlot({ date, time });

    return res
      .status(200)
      .json({
        message: "Slot was successfully created.",
        slot,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const deleteSingleConsultationSlot = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteConsultationSlotById(id);

    return res
      .status(200)
      .json({ message: "Slot was successfully deleted." })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

module.exports = {
  getAllConsultationSlots,
  getAllAvailableConsultationSlots,
  createSingleConsultationSlot,
  deleteSingleConsultationSlot,
};
