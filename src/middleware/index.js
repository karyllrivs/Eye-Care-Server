const { get, merge } = require("lodash");
const {
  getUserBySessionToken,
  getUserById,
} = require("../models/user.model.js");

const isAuthenticated = async (req, res, next) => {
  try {
    const { flutter_user_id } = req.body;

    const { AUTH_COOKIE_NAME } = process.env;
    const sessionToken = req.cookies[AUTH_COOKIE_NAME];

    if (!flutter_user_id) {
      if (!sessionToken)
        return res
          .status(403)
          .json({
            message:
              "This request is forbidden. Login to your account first to proceed.",
          })
          .end();
    }

    const existingUser = flutter_user_id
      ? await getUserById(flutter_user_id)
      : await getUserBySessionToken(sessionToken);
    if (!existingUser)
      return res
        .status(403)
        .json({
          message:
            "This request is forbidden. Login to your account first to proceed.",
        })
        .end();

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const isOwner = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const currentUserId = get(req, "identity._id");
    if (!currentUserId)
      return res
        .status(403)
        .json({ message: "This request is forbidden." })
        .end();

    if (currentUserId.toString() !== user_id)
      return res
        .status(403)
        .json({ message: "This request is forbidden." })
        .end();

    return next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

module.exports = { isAuthenticated, isOwner };
