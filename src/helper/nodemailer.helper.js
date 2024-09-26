const nodemailer = require("nodemailer");

const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = process.env;

const sendEmail = async (recipientEmail, subject, html) => {
  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail", // use your email service provider
    auth: {
      user: NODEMAILER_EMAIL, // your email
      pass: NODEMAILER_PASSWORD, // your email password or app password
    },
  });

  // Set up email data
  let mailOptions = {
    from: NODEMAILER_EMAIL, // sender address
    to: recipientEmail, // list of receivers
    subject, // Subject line
    html, // html body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};

module.exports = { sendEmail };
