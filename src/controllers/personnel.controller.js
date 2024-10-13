const {
  getPersonnelsByRole,
  deletePersonnelById,
  createPersonnel,
  getPersonnelByUsername,
  getPersonnelBySessionToken,
  getPersonnelById,
  updatePersonnelById,
  getPersonnels,
} = require("../models/personnel.model.js");

const { authentication, random } = require("../helper/index.js");
const delete_file = require("../helper/file_unlink.js");

const createPersonnelAccount = async (req, res) => {
  try {
    const { username, password, profile, role } = req.body;
    const { name, image, mobile, birthday, age, gender, address } = profile;

    let personnel_image = image ?? "";
    if (req.file) {
      personnel_image = req.file.filename;
    }

    if (
      !username ||
      !password ||
      !name ||
      !mobile ||
      !birthday ||
      !age ||
      !gender ||
      !address ||
      !role
    ) {
      return res
        .status(400)
        .json({
          message: "Fill all required fields.",
        })
        .end();
    }

    const existingUsername = await getPersonnelByUsername(username);
    if (existingUsername)
      return res
        .status(400)
        .json({ message: "The username provided already exist." })
        .end();

    const salt = random();
    const personnel = await createPersonnel({
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      profile: {
        image: personnel_image,
        name,
        mobile,
        birthday,
        age,
        gender,
        address,
      },
      role,
    });

    return res
      .status(200)
      .json({ message: "Account successfully created.", personnel })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Fill all required fields." })
      .end();
  }
};

const loginPersonnelAccount = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.sendStatus(400);

    const personnel = await getPersonnelByUsername(username).select(
      "+authentication.salt + authentication.password"
    );
    if (!personnel)
      return res
        .status(403)
        .json({ message: "Incorrect Username or Password." })
        .end();

    const expectedHash = authentication(
      personnel.authentication.salt,
      password
    );
    if (personnel.authentication.password !== expectedHash)
      return res
        .status(403)
        .json({ message: "Incorrect Username or Password." })
        .end();

    const salt = random();
    const authToken = authentication(salt, personnel._id.toString());
    personnel.authentication.sessionToken = authToken;
    await personnel.save();

    const currentPersonnel = await getPersonnelBySessionToken(authToken);

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
        currentPersonnel,
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

const updatePersonnelAccount = async (req, res) => {
  try {
    const { personnel_id } = req.params;
    const { username, password, profile, role } = req.body;
    const { name, mobile, birthday, age, gender, address } = profile;

    if (
      !username ||
      !name ||
      !mobile ||
      !birthday ||
      !age ||
      !gender ||
      !address ||
      !role
    ) {
      return res
        .status(400)
        .json({
          message: "Fill all required fields.",
        })
        .end();
    }

    const currentPersonnel = await getPersonnelById(personnel_id);
    if (req.file) {
      delete_file(currentPersonnel.profile.image);
    }
    const image = req.file ? req.file.filename : currentPersonnel.profile.image;

    let personnel = {};

    if (password) {
      const salt = random();
      personnel = await updatePersonnelById(personnel_id, {
        username,
        authentication: {
          salt,
          password: authentication(salt, password),
        },
        profile: {
          image,
          name,
          mobile,
          birthday,
          age,
          gender,
          address,
        },
        role,
      });
    } else {
      personnel = await updatePersonnelById(personnel_id, {
        username,
        profile: {
          image,
          name,
          mobile,
          birthday,
          age,
          gender,
          address,
        },
        role,
      });
    }

    if (!personnel)
      return res.status(404).json({ message: "Account not found." }).end();

    return res
      .status(200)
      .json({
        message: "Personnel Account successfully updated.",
        personnel,
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

const getAllPersonnels = async (req, res) => {
  try {
    const personnels = await getPersonnels();

    return res.status(200).json(personnels).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getAllPersonnelByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const personnels = await getPersonnelsByRole(role);

    return res.status(200).json(personnels).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const deletePersonnel = async (req, res) => {
  try {
    const { id } = req.params;

    const personnel = await deletePersonnelById(id);

    delete_file(personnel.profile.image);

    return res
      .status(200)
      .json({ message: "Personnel successfully deleted." })
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
  getAllPersonnels,
  createPersonnelAccount,
  loginPersonnelAccount,
  updatePersonnelAccount,
  getAllPersonnelByRole,
  deletePersonnel,
};
