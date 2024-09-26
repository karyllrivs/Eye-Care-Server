const {
  createUser,
  getUserByEmail,
  getUserBySessionToken,
  updateUserById,
  getUserByPasswordResetToken,
  getUserByVerificationToken,
} = require("../models/user.model.js");
const {
  authentication,
  random,
  randomPasswordToken,
  randomVerificationToken,
} = require("../helper/index.js");
const { config } = require("dotenv");
const {
  createProfile,
  getProfileByUserId,
} = require("../models/profile.model.js");
const {
  sendVerificationToken,
  sendPasswordResetToken,
} = require("../helper/email_message.helper.js");
const { get } = require("lodash");

config();

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password)
      return res
        .status(400)
        .json({ message: "Fill all required fields." })
        .end();

    const existingEmail = await getUserByEmail(email);
    if (existingEmail)
      return res
        .status(400)
        .json({ message: "The email provided already exist." })
        .end();

    const verificationToken = randomVerificationToken();
    const salt = random();
    const user = await createUser({
      email,
      first_name,
      last_name,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      verificationToken,
    });

    await createProfile({
      user_id: user._id,
      email,
      first_name,
      last_name,
    });

    /** Send Email */
    const fullName = `${user.first_name} ${user.last_name}`;
    await sendVerificationToken(email, fullName, verificationToken);

    return res
      .status(200)
      .json({
        message:
          "Account successfully created. Check your email for the verification token.",
        user,
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

const verifyAccount = async (req, res) => {
  const { token } = req.body;

  const user = await getUserByVerificationToken(token);
  if (!user)
    return res
      .status(400)
      .json({ message: "The token provided is invalid." })
      .end();

  const isVerified = true;
  await updateUserById(user._id, {
    isVerified,
  });

  try {
    return res
      .status(200)
      .json({
        message: "Your account is successfully verified. Login your account.",
      })
      .end();
  } catch (e) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(403)
        .json({ message: "Fill all required fields." })
        .end();

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password +authentication.sessionToken"
    );
    if (!user)
      return res
        .status(403)
        .json({ message: "Incorrect Email or Password." })
        .end();

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash)
      return res
        .status(403)
        .json({ message: "Incorrect Email or Password." })
        .end();

    /** Check if not verified. */
    if (!user.isVerified) {
      const verificationToken = randomVerificationToken();
      await updateUserById(user._id, {
        verificationToken,
      });

      /** Send email */
      const fullName = `${user.first_name} ${user.last_name}`;
      await sendVerificationToken(user.email, fullName, verificationToken);

      return res
        .status(403)
        .json({ message: "Your email is not verified.", notVerified: true })
        .end();
    }

    /** Check if already logged in. */
    if (user.authentication.sessionToken) {
      return res
        .status(403)
        .json({ message: "User already logged in from another session." })
        .end();
    }

    const salt = random();
    const authToken = authentication(salt, user._id.toString());
    user.authentication.sessionToken = authToken;
    await user.save();

    const currentUser = await getUserBySessionToken(authToken);
    const profile = await getProfileByUserId(currentUser._id);

    const { AUTH_COOKIE_NAME } = process.env;
    res.cookie(AUTH_COOKIE_NAME, authToken, {
      maxAge: 24 * 60 * 60 * 1000, //equivalent to one day
      path: "/",
      hhtpOnly: true,
        secure: true,
        sameSite: "None"
    });
    return res
      .status(200)
      .json({
        message: "Account successfully logged in.",
        currentUser,
        profile,
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

const createTokenForPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(403).json({ message: "Email is required." }).end();

    const user = await getUserByEmail(email);
    if (!user)
      return res
        .status(403)
        .json({
          message: "The email provided is not associated with any user.",
        })
        .end();

    const passwordResetToken = randomPasswordToken();

    await updateUserById(user._id, {
      passwordResetToken,
    });

    /** Send Email */
    const fullName = `${user.first_name} ${user.last_name}`;
    await sendPasswordResetToken(user.email, fullName, passwordResetToken);

    return res
      .status(200)
      .json({
        message: "Check your email for password reset token.",
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

const confirmTokenAndChangePassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword)
      return res
        .status(403)
        .json({ message: "Fill all required fields." })
        .end();

    if (password !== confirmPassword)
      return res
        .status(403)
        .json({ message: "Password confirmation does not matched." })
        .end();

    const user = await getUserByPasswordResetToken(token);
    if (!user)
      return res
        .status(403)
        .json({
          message: "The token provided is incorrect.",
        })
        .end();

    const salt = random();
    await updateUserById(user._id, {
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res
      .status(200)
      .json({
        message:
          "The password is successfully changed. Login your account using the new password.",
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

const logout = async (req, res) => {
  try {
    const user = get(req, "identity");
    user.authentication.sessionToken = null;
    await user.save();
    return res
      .status(200)
      .json({ message: "User is successfully logout." })
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
  register,
  verifyAccount,
  login,
  createTokenForPasswordReset,
  confirmTokenAndChangePassword,
  logout,
};
