const {
  getCategories,
  getCategoryById,
  createCategory,
  deleteCategoryById,
  updateCategoryById,
} = require("../models/category.model.js");
const {
  getProductsByCategoryId,
  getProducts,
} = require("../models/product.model.js");

const getAllCategories = async (req, res) => {
  try {
    const categories = await getCategories();

    return res.status(200).json(categories).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const getSingleCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const category = await getCategoryById(category_id);
    const products = await getProductsByCategoryId(category_id);

    return res.status(200).json({ category, products }).end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." })
      .end();
  }
};

const createSingleCategory = async (req, res) => {
  try {
    const { name, description, isInNavbar } = req.body;

    const category = await createCategory({ name, description, isInNavbar });

    return res
      .status(200)
      .json({
        message: "Category successfully created.",
        category,
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

const updateSingleCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { name, description, isInNavbar } = req.body;

    const category = await updateCategoryById(category_id, {
      name,
      description,
      isInNavbar,
    });

    if (!category)
      return res.status(404).json({ message: "Category not found." }).end();

    return res
      .status(200)
      .json({
        message: "Category successfully updated.",
        category,
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

const deleteSingleCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    await deleteCategoryById(category_id);

    return res
      .status(200)
      .json({ message: "Category successfully deleted." })
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
  getAllCategories,
  getSingleCategory,
  createSingleCategory,
  updateSingleCategory,
  deleteSingleCategory,
};
