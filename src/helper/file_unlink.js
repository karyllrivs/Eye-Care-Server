const fs = require("fs");
const path = require("path");

const checkFileExistsSync = (filename) => {
  try {
    const filePath = path.join("public", "uploads", filename);
    fs.accessSync(filePath, fs.constants.F_OK);
    return true; // File exists
  } catch (err) {
    console.log(err);
    return false; // File does not exist
  }
};

const delete_file = (filename) => {
  if (checkFileExistsSync(filename)) {
    const filePath = path.join("public", "uploads", filename);
    fs.unlinkSync(filePath);
    console.log("File deleted");
  } else {
    console.log("File does not exist");
  }
};

module.exports = delete_file;
