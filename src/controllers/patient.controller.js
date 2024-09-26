const {
  getPatients,
  createPatient,
  deletePatientById,
  updatePatientById,
} = require("../models/patient.model.js");

const getAllPatients = async (req, res) => {
  try {
    const patients = await getPatients();

    return res.status(200).json(patients).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createSinglePatient = async (req, res) => {
  try {
    const { name, email, mobile, address, age, birthday, gender } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !address ||
      !age ||
      !birthday ||
      !gender
    ) {
      return res
        .status(400)
        .json({
          message: "Fill all required fields.",
        })
        .end();
    }

    const patient = await createPatient({
      name,
      email,
      mobile,
      address,
      age,
      birthday,
      gender,
    });

    return res
      .status(200)
      .json({
        message: "Patient successfully created.",
        patient,
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

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, address, age, birthday, gender } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !address ||
      !age ||
      !birthday ||
      !gender
    ) {
      return res
        .status(400)
        .json({
          message: "Fill all required fields.",
        })
        .end();
    }

    const patient = await updatePatientById(id, {
      name,
      email,
      mobile,
      address,
      age,
      birthday,
      gender,
    });

    if (!patient)
      return res.status(404).json({ message: "Patient not found." }).end();

    return res
      .status(200)
      .json({
        message: "Patient successfully updated.",
        patient,
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

const updatePatientLens = async (req, res) => {
  try {
    const { lensConsultation } = req.body;
    const {
      patient_id,
      consultationDate,
      consultationTime,
      laboratoryName,
      frame,
      pxName,
      previousEyeGrade,
      currentEyeGrade,
      pd,
      lens,
      lensType,
      mcBrand,
      mcType,
      tint,
      labInstruction,
    } = lensConsultation;

    if (
      !patient_id ||
      !consultationDate ||
      !consultationTime ||
      !laboratoryName ||
      !frame ||
      !pxName ||
      !previousEyeGrade ||
      !currentEyeGrade ||
      !pd ||
      !lens ||
      !lensType ||
      !mcBrand ||
      !mcType ||
      !tint ||
      !labInstruction
    ) {
      return res
        .status(400)
        .json({
          message: "Fill all fields.",
        })
        .end();
    }

    const patient = await updatePatientById(patient_id, {
      lensConsultation,
    });

    if (!patient)
      return res.status(404).json({ message: "Patient not found." }).end();

    return res
      .status(200)
      .json({
        message: "Patient visit details successfully updated.",
        patient,
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

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    await deletePatientById(id);

    return res
      .status(200)
      .json({ message: "Patient successfully deleted." })
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
  getAllPatients,
  createSinglePatient,
  updatePatient,
  updatePatientLens,
  deletePatient,
};
