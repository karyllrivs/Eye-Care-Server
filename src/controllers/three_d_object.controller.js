const {
  getThreeDObjectByProductId,
  createThreeDObject,
  getThreeDObjects,
  deleteThreeDObjectById,
} = require("../models/three_d_object.model");
const delete_file = require("../helper/file_unlink.js");

const getAllObjects = async (req, res) => {
  try {
    const objects = await getThreeDObjects();

    return res.status(200).json(objects).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getAllObjectByProductId = async (req, res) => {
  try {
    const { product_id } = req.params;
    const objects = await getThreeDObjectByProductId(product_id);

    return res.status(200).json(objects).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createObject = async (req, res) => {
  try {
    const { product_id } = req.params;

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    if (!image) {
      return res
        .status(400)
        .json({
          message: "An image is required.",
        })
        .end();
    }

    const object = await createThreeDObject({
      product_id,
      image,
    });

    return res
      .status(200)
      .json({
        message: "Virtual Try-on image is successfully added.",
        object,
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

const deleteObject = async (req, res) => {
  try {
    const { object_id } = req.params;

    const vto = await deleteThreeDObjectById(object_id);

    delete_file(vto.image);

    return res
      .status(200)
      .json({ message: "Virtual Try-on image is successfully deleted." })
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
  getAllObjects,
  getAllObjectByProductId,
  createObject,
  deleteObject,
};
