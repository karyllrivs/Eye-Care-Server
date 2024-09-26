const {
  createAdmin,
  getAdminByUsername,
  getAdminBySessionToken,
} = require("../models/admin.model.js");
const { authentication, random } = require("../helper/index.js");
const { config } = require("dotenv");

config();

const adminRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUsername = await getAdminByUsername(username);
    if (existingUsername)
      return res
        .status(400)
        .json({ message: "The username provided already exist." })
        .end();

    const salt = random();
    const admin = await createAdmin({
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res
      .status(200)
      .json({ message: "Account successfully created.", admin })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.sendStatus(400);

    const admin = await getAdminByUsername(username).select(
      "+authentication.salt + authentication.password"
    );
    if (!admin)
      return res
        .status(403)
        .json({ message: "Incorrect Username or Password." })
        .end();

    const expectedHash = authentication(admin.authentication.salt, password);
    if (admin.authentication.password !== expectedHash)
      return res
        .status(403)
        .json({ message: "Incorrect Username or Password." })
        .end();

    const salt = random();
    const authToken = authentication(salt, admin._id.toString());
    admin.authentication.sessionToken = authToken;
    await admin.save();

    const currentAdmin = await getAdminBySessionToken(authToken);

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
        currentAdmin,
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

module.exports = { adminRegister, adminLogin };
