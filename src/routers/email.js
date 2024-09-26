const { sendEmail } = require("../helper/nodemailer.helper");

const sendAnEmail = async (req, res) => {
  try {
    const { recipientEmail, subject, html } = req.body;
    await sendEmail(recipientEmail, subject, html);

    return res
      .status(200)
      .json({
        message: "Email successfully sent!",
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

module.exports = (router) => {
  router.post("/email", sendAnEmail);
};
