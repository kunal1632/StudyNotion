const Category = require("../models/Category");

// create Tag handler function
exports.createCategory = async (req, res) => {
  try {
    // fetching data
    const { name, description } = req.body;

    // validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "all feilds are required",
      });
    }

    // create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all tas handler

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    // get category id
    const { categoryId } = req.body;

    // get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate("Course")
      .exec();

    console.log(selectedCategory);

    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // handle the case when category found but it has not courses
    if (selectedCategory.course.length === 0) {
      console.log("No courses found for the selected category");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category",
      });
    }

    // get course for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("Course")
      .exec();

    // top selling course

    // return reposne
    return res.status(200).json({
      success: true,
      data: { selectedCategory, differentCategories },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
