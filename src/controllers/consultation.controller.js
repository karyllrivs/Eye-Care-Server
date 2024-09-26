const { get } = require("lodash");
const {
  getConsultations,
  getConsultationsByUserId,
  createConsultation,
  deleteConsultationById,
  updateConsultationById,
  getArchivedConsultations,
  getConsultationById,
} = require("../models/consultation.model.js");
const {
  makeConsultationSlotUnavailableById,
} = require("../models/consultation_slot.model.js");

const getAllConsultations = async (req, res) => {
  try {
    const consultation = await getConsultations();

    return res.status(200).json(consultation).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getAllArchivedConsultations = async (req, res) => {
  try {
    const consultation = await getArchivedConsultations();

    return res.status(200).json(consultation).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getUserConsultations = async (req, res) => {
  try {
    const { user_id } = req.params;
    const consultations = await getConsultationsByUserId(user_id);

    return res.status(200).json(consultations).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createUserConsultation = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");
    const name =
      get(req, "identity.first_name") + " " + get(req, "identity.last_name");
    const email = get(req, "identity.email");

    const { slotId, date, time, mobile, status } = req.body;

    const consultation = await createConsultation({
      user_id,
      name,
      date,
      time,
      email,
      mobile,
      status,
    });

    await makeConsultationSlotUnavailableById(slotId);

    return res
      .status(200)
      .json({
        message: "Consultation successfully created.",
        consultation,
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

const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const consultation = await updateConsultationById(id, {
      status,
    });

    if (!consultation)
      return res.status(404).json({ message: "Consultation not found." }).end();

    return res
      .status(200)
      .json({
        message: "Consultation successfully updated.",
        consultation,
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

const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    /** Get consultation */
    const consultation = await getConsultationById(id);

    if (consultation.isDeleted) {
      await deleteConsultationById(id);

      return res
        .status(200)
        .json({ message: "Consultation successfully deleted permanently." })
        .end();
    }

    const isDeleted = true;
    const archivedConsultation = await updateConsultationById(id, {
      isDeleted,
    });

    if (!archivedConsultation)
      return res.status(404).json({ message: "Consultation not found." }).end();

    return res
      .status(200)
      .json({ message: "Consultation successfully deleted." })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const restoreArchivedConsultation = async (req, res) => {
  const { id } = req.params;

  const isDeleted = false;
  const restoredConsultation = await updateConsultationById(id, {
    isDeleted,
  });

  if (!restoredConsultation)
    return res.status(404).json({ message: "Consultation not found." }).end();

  return res
    .status(200)
    .json({ message: "Consultation successfully restored." })
    .end();
};

module.exports = {
  getAllConsultations,
  getAllArchivedConsultations,
  getUserConsultations,
  createUserConsultation,
  updateConsultation,
  deleteConsultation,
  restoreArchivedConsultation,
};
