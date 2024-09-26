const { sendEmail } = require("./nodemailer.helper");

const sendVerificationToken = async (
  recipientEmail,
  fullName,
  verificationToken
) => {
  /** Send email */
  const subject = "Registration Token";
  const html = `
     <p>Dear ${fullName},</p>
     <p>Thank you for registering with <strong>EYECARE</strong>. To complete your registration, please verify your email address by using the verification token below:</p>
     <p><strong>${verificationToken}</strong></p>
     <p>Please enter this token on the verification page to activate your account.</p>
     <p>If you did not create an account with us, please ignore this email.</p>
     <p>Thank you,<br>
     The <strong>EYECARE</strong> Team</p>
     <hr>
     <p>If you have any questions or need assistance, please contact our support team.</p>
     <p>Support Team Contact Information:<br>
     Email: <a href="mailto:eyecareee24@gmail.com.com">eyecareee24@gmail.com.com</a><br>
     Phone: (02) 8641 0560</p>
     <p>Please do not reply to this email as this inbox is not monitored.</p>
     <hr>
     <p>EYECARE | 159 M. L. Quezon Ave, Street, Antipolo, 1870 Rizal`;
  await sendEmail(recipientEmail, subject, html);
};

const sendPasswordResetToken = async (
  recipientEmail,
  fullName,
  passwordResetToken
) => {
  const subject = "Password Reset";
  const html = `<p>Dear ${fullName},</p>
    <p>We received a request to reset your password for your <strong>EYECARE</strong> account. If you did not request a password reset, please ignore this email.</p>
    <p>Otherwise, you can reset your password using the token below:</p>
    <p><strong>${passwordResetToken}</strong></p>
    <p>For security reasons, this token will expire in 24 hours.</p>
    <p>If you encounter any issues or need further assistance, please don't hesitate to contact our support team.</p>
    <p>Thank you,<br>
    The <strong>EYECARE</strong> Team</p>
    <hr>
    <p>If you didn't request this change or believe an unauthorized person has accessed your account, please contact our support team immediately.</p>
    <p>Support Team Contact Information:<br>
    Email: <a href="mailto:eyecareee24@gmail.com.com">eyecareee24@gmail.com.com</a><br>
    Phone: (02) 8641 0560</p>
    <p>Please do not reply to this email as this inbox is not monitored.</p>
    <hr>
    <p>EYECARE | 159 M. L. Quezon Ave, Street, Antipolo, 1870 Rizal`;
  await sendEmail(recipientEmail, subject, html);
};

const sendCheckoutOTP = async (recipientEmail, fullName, OTP) => {
  const subject = "OTP Verification";
  const html = `<p>Dear ${fullName},</p>
    <p>We received a request to checkout orders for your <strong>EYECARE</strong> account. If you did not request to checkout orders, please ignore this email.</p>
    <p>Otherwise, you can checkout orders using the OTP below:</p>
    <p><strong>${OTP}</strong></p>
    <p>For security reasons, this OTP will expire in 24 hours.</p>
    <p>If you encounter any issues or need further assistance, please don't hesitate to contact our support team.</p>
    <p>Thank you,<br>
    The <strong>EYECARE</strong> Team</p>
    <hr>
    <p>If you didn't request this change or believe an unauthorized person has accessed your account, please contact our support team immediately.</p>
    <p>Support Team Contact Information:<br>
    Email: <a href="mailto:eyecareee24@gmail.com.com">eyecareee24@gmail.com.com</a><br>
    Phone: (02) 8641 0560</p>
    <p>Please do not reply to this email as this inbox is not monitored.</p>
    <hr>
    <p>EYECARE | 159 M. L. Quezon Ave, Street, Antipolo, 1870 Rizal`;
  await sendEmail(recipientEmail, subject, html);
};

const sendGoogleAccountPassword = async (
  recipientEmail,
  fullName,
  password
) => {
  /** Send email */
  const subject = "Registration Token";
  const html = `
     <p>Dear ${fullName},</p>
     <p>Thank you for registering with <strong>EYECARE</strong>. Your account password is indicated below:</p>
     <p><strong>${password}</strong></p>
     <p>You can use this password for the authentication of your account or you can use Google Sign-in for signing up.</p>
     <p>If you did not create an account with us, please ignore this email.</p>
     <p>Thank you,<br>
     The <strong>EYECARE</strong> Team</p>
     <hr>
     <p>If you have any questions or need assistance, please contact our support team.</p>
     <p>Support Team Contact Information:<br>
     Email: <a href="mailto:eyecareee24@gmail.com.com">eyecareee24@gmail.com.com</a><br>
     Phone: (02) 8641 0560</p>
     <p>Please do not reply to this email as this inbox is not monitored.</p>
     <hr>
     <p>EYECARE | 159 M. L. Quezon Ave, Street, Antipolo, 1870 Rizal`;
  await sendEmail(recipientEmail, subject, html);
};

module.exports = {
  sendVerificationToken,
  sendPasswordResetToken,
  sendCheckoutOTP,
  sendGoogleAccountPassword,
};
