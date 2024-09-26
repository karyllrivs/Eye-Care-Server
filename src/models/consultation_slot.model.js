const mongoose = require("mongoose");

const ConsultationSlot = new mongoose.Schema({
  date: String,
  time: String,
  isAvailable: { type: Boolean, default: true },
});

const ConsultationSlotModel = mongoose.model(
  "consultation_slot",
  ConsultationSlot
);

const getConsultationSlots = () => ConsultationSlotModel.find();
const getAvailableConsultationSlots = () =>
  ConsultationSlotModel.find({ isAvailable: true });
const getConsultationSlotByDateTime = (date, time) =>
  ConsultationSlotModel.findOne({ date, time });
const getConsultationSlotById = (id) => ConsultationSlotModel.findById(id);
const createConsultationSlot = (values) =>
  new ConsultationSlotModel(values).save().then((v) => v.toObject());
const deleteConsultationSlotById = (id) =>
  ConsultationSlotModel.findByIdAndDelete(id);
const updateConsultationSlotById = (id, values) =>
  ConsultationSlotModel.findByIdAndUpdate(id, values);
const makeConsultationSlotUnavailableById = (id) =>
  ConsultationSlotModel.findByIdAndUpdate(id, { isAvailable: false });

module.exports = {
  getConsultationSlots,
  getAvailableConsultationSlots,
  getConsultationSlotByDateTime,
  getConsultationSlotById,
  makeConsultationSlotUnavailableById,
  createConsultationSlot,
  deleteConsultationSlotById,
  updateConsultationSlotById,
};
