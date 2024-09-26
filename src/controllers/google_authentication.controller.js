const {
  randomVerificationToken,
  authentication,
  random,
} = require("../helper");
const {
  sendVerificationToken,
  sendGoogleAccountPassword,
} = require("../helper/email_message.helper");
const {
  getUserByEmail,
  updateUserById,
  getUserBySessionToken,
  createUser,
} = require("../models/user.model");
const {
  getProfileByUserId,
  createProfile,
} = require("../models/profile.model");
const { config } = require("dotenv");

config();

const { AUTH_COOKIE_NAME, SERVER_URL } = process.env;

const googleInitialize = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.redirect(`${SERVER_URL}/api/auth-google/login/${email}`);
    }

    return res.redirect(`${SERVER_URL}/api/auth-google/register/${email}`);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const googleLogin = async (req, res) => {
  const { email } = req.params;

  const user = await getUserByEmail(email);

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

  res.cookie(AUTH_COOKIE_NAME, authToken, {
    maxAge: 24 * 60 * 60 * 1000, //equivalent to one day
    path: "/",
  });
  return res
    .status(200)
    .json({
      message: "Account successfully logged in.",
      currentUser,
      profile,
    })
    .end();
};

const googleRegister = async (req, res) => {
  const { email } = req.params;

  const first_name = "Google Account";
  const last_name = "User";
  const password = randomVerificationToken();
  const salt = random();

  const user = await createUser({
    email,
    first_name,
    last_name,
    authentication: {
      salt,
      password: authentication(salt, password),
    },
    isVerified: true,
  });

  const profile = await createProfile({
    user_id: user._id,
    email,
    first_name,
    last_name,
  });

  await sendGoogleAccountPassword(
    email,
    first_name + " " + last_name,
    password
  );

  //   Login account
  const authToken = authentication(salt, user._id.toString());
  await updateUserById(user._id, {
    authentication: {
      salt,
      password: authentication(salt, password),
      sessionToken: authToken,
    },
  });

  res.cookie(AUTH_COOKIE_NAME, authToken, {
    maxAge: 24 * 60 * 60 * 1000, //equivalent to one day
    path: "/",
  });
  return res
    .status(200)
    .json({
      message:
        "Account successfully created. Check your email for your account password.",
      currentUser: user,
      profile,
    })
    .end();
};

module.exports = { googleInitialize, googleLogin, googleRegister };
