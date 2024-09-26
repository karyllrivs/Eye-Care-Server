const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: { type: String },
  date: { type: String },
  time: { type: String },
  email: { type: String },
  mobile: { type: String },
  status: { type: String },
  isDeleted: { type: Boolean, default: false },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const ConsultationModel = mongoose.model("consultation", ConsultationSchema);

const getConsultations = () => ConsultationModel.find({ isDeleted: false });
const getArchivedConsultations = () =>
  ConsultationModel.find({ isDeleted: true });
const getConsultationsByUserId = (user_id) =>
  ConsultationModel.find({ user_id });
const getConsultationById = (id) => ConsultationModel.findById(id);
const createConsultation = (values) =>
  new ConsultationModel(values).save().then((v) => v.toObject());
const deleteConsultationById = (id) => ConsultationModel.findByIdAndDelete(id);
const updateConsultationById = (id, values) =>
  ConsultationModel.findByIdAndUpdate(id, values);

module.exports = {
  getConsultations,
  getArchivedConsultations,
  getConsultationsByUserId,
  getConsultationById,
  createConsultation,
  deleteConsultationById,
  updateConsultationById,
};
