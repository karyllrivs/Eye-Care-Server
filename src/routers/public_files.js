const path = require("path");
module.exports = (router) => {
  router.get("/file/:filename", getFile);
};

const getFile = async (req, res) => {
  try {
    const { filename } = req.params;
    res.sendFile(path.resolve("public/uploads/" + filename));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};
