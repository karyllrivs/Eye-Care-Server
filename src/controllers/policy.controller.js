const { getPolicies, createPolicy } = require("../models/policy.model.js");

const getAllPolicies = async (req, res) => {
  try {
    const policies = await getPolicies();

    return res.status(200).json(policies).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createSinglePolicy = async (req, res) => {
  try {
    const { name, content } = req.body;

    const policy = await createPolicy({ name, content });

    return res
      .status(200)
      .json({
        message: "Policy successfully created.",
        policy,
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

module.exports = {
  getAllPolicies,
  createSinglePolicy,
};
