const { OrderModel } = require("../models/order.model");
const { PatientModel } = require("../models/patient.model");
const { UserModel } = require("../models/user.model");

module.exports = (router) => {
  router.get("/analytics", async (req, res) => {
    try {
      const totalAmount = await OrderModel.aggregate([
        {
          $match: { status: "Delivered" },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      const totalSalesAmount =
        totalAmount.length > 0 ? totalAmount[0].total : 0;
      const customerTotal = await UserModel.countDocuments();
      const orderTotal = await OrderModel.countDocuments();
      const patientTotal = await PatientModel.countDocuments();

      const customers = await UserModel.aggregate([
        {
          $group: {
            _id: { $month: "$date_created" },
            count: { $sum: 1 },
          },
        },
      ]);

      const sales = await OrderModel.aggregate([
        {
          $match: { status: "Delivered" },
        },
        {
          $group: {
            _id: { $month: "$date_created" },
            total: { $sum: "$total" },
          },
        },
      ]);

      const patients = await PatientModel.aggregate([
        {
          $group: {
            _id: { $month: "$date_created" },
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({
        totalSalesAmount,
        customerTotal,
        orderTotal,
        patientTotal,
        customers,
        sales,
        patients,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });
};
