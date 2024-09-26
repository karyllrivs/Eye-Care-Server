const delete_file = require("../helper/file_unlink.js");
const { updateOrderByProductId } = require("../models/order.model.js");
const {
  getProducts,
  searchProduct,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,
} = require("../models/product.model.js");

const getAllProducts = async (req, res) => {
  try {
    const products = await getProducts();

    return res.status(200).json(products).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getSearchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword) return res.status(200).json([]).end();

    const products = await searchProduct(keyword);

    return res.status(200).json(products).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await getProductById(product_id);

    return res.status(200).json(product).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createSingleProduct = async (req, res) => {
  try {
    const { category_id, category_name, name, description, price, stock } =
      req.body;
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    if (
      !category_id ||
      !category_name ||
      !name ||
      !description ||
      !price ||
      !stock ||
      !image
    ) {
      return res
        .status(400)
        .json({
          message: "Fill all required fields.",
        })
        .end();
    }

    const product = await createProduct({
      category_id,
      category_name,
      name,
      image,
      description,
      price,
      stock,
    });

    return res
      .status(200)
      .json({
        message: "Product successfully created.",
        product,
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

const updateSingleProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { category_id, category_name, name, description, price, stock } =
      req.body;

    const currentProduct = await getProductById(product_id);
    if (req.file) {
      delete_file(currentProduct.image);
    }
    const image = req.file ? req.file.filename : currentProduct.image;

    const product = await updateProductById(product_id, {
      image,
      category_id,
      category_name,
      name,
      description,
      price,
      stock,
    });

    if (!product)
      return res.status(404).json({ message: "Product not found." }).end();

    await updateOrderByProductId(product._id, { image });

    return res
      .status(200)
      .json({
        message: "Product successfully updated.",
        product,
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

const deleteSingleProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    const product = await deleteProductById(product_id);

    delete_file(product.image);

    return res
      .status(200)
      .json({ message: "Product successfully deleted." })
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
  getAllProducts,
  getSingleProduct,
  getSearchProducts,
  createSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
};
