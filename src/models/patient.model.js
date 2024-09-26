const mongoose = require("mongoose");

const EyeGradeSchema = new mongoose.Schema({
  sphere: String,
  cylinder: String,
  axis: String,
  add: String,
});

const LensConsultationSchema = new mongoose.Schema({
  laboratoryName: String,
  frame: String,
  consultationDate: String,
  consultationTime: String,
  pxName: String,
  previousEyeGrade: {
    OD: EyeGradeSchema,
    OS: EyeGradeSchema,
  },
  currentEyeGrade: {
    OD: EyeGradeSchema,
    OS: EyeGradeSchema,
  },
  pd: String,
  lens: {
    type: String, // 'single vision' or 'double vision'
    enum: ["single vision", "double vision"],
  },
  doubleVisionOptions: {
    type: String,
    enum: ["KK", "FT28", "FT35", "NL", "PROG"],
    required: function () {
      return this.lens === "double vision";
    },
  },
  lensType: {
    type: String, // 'plastic' or 'glass'
    enum: ["plastic", "glass"],
  },
  mcBrand: String,
  mcType: {
    type: String, // '1.5' or '1.56'
    enum: ["1.5", "1.56"],
  },
  tint: String,
  labInstruction: String,
});

const PatientSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  address: String,
  age: String,
  birthday: String,
  gender: String,
  lensConsultation: LensConsultationSchema,
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const PatientModel = mongoose.model("patient", PatientSchema);

const getPatients = () => PatientModel.find();
const getPatientById = (id) => PatientModel.findById(id);
const createPatient = (values) =>
  new PatientModel(values).save().then((v) => v.toObject());
const deletePatientById = (id) => PatientModel.findByIdAndDelete(id);
const updatePatientById = (id, values) =>
  PatientModel.findByIdAndUpdate(id, values);

module.exports = {
  PatientModel,
  getPatients,
  getPatientById,
  createPatient,
  deletePatientById,
  updatePatientById,
};
