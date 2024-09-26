const { get } = require("lodash");
const {
  getProfiles,
  createProfile,
  deleteProfileByUserId,
  updateProfileByUserId,
  getProfileByUserId,
} = require("../models/profile.model.js");
const delete_file = require("../helper/file_unlink.js");
const { updateUserById } = require("../models/user.model.js");
const { random, authentication } = require("../helper/index.js");

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await getProfiles();

    return res.status(200).json(profiles).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const profile = await getProfileByUserId(user_id);

    return res.status(200).json(profile).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createUserProfile = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");
    const first_name = get(req, "identity.first_name");
    const last_name = get(req, "identity.last_name");
    const email = get(req, "identity.email");
    const { image, address, mobile_number } = req.body;

    const profile = await createProfile({
      user_id,
      image,
      first_name,
      last_name,
      address,
      email,
      mobile_number,
    });

    return res
      .status(200)
      .json({ message: "Profile successfully created.", profile })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");

    let image = "";
    const {
      first_name,
      last_name,
      address,
      email,
      mobile_number,
      new_password,
    } = req.body;

    if (new_password) {
      const salt = random();
      const { AUTH_COOKIE_NAME } = process.env;
      const sessionToken = req.cookies[AUTH_COOKIE_NAME];

      await updateUserById(user_id, {
        first_name,
        last_name,
        email,
        authentication: {
          salt,
          password: authentication(salt, new_password),
          sessionToken,
        },
      });
    } else {
      await updateUserById(user_id, {
        first_name,
        last_name,
        email,
      });
    }

    const currentProfile = await getProfileByUserId(user_id);
    if (req.file) {
      /** Delete old image file */
      if (currentProfile) {
        // Delete the current image file
        delete_file(currentProfile.image);
      }

      image = req.file.filename;
    } else {
      image = currentProfile.image;
    }

    const updatedProfile = await updateProfileByUserId(user_id, {
      image,
      first_name,
      last_name,
      address,
      email,
      mobile_number,
    });

    if (!updatedProfile)
      return res.status(404).json({ message: "Profile not found." }).end();

    const profile = await getProfileByUserId(user_id);

    return res
      .status(200)
      .json({ message: "Profile successfully updated.", profile })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const user_id = get(req, "identity._id");

    const profile = await deleteProfileByUserId(user_id);

    delete_file(profile.image);

    return res
      .status(200)
      .json({ message: "Profile successfully deleted." })
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
  getAllProfiles,
  getProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
