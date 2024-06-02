const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });

    // update course with seciton objectID
    const updatedCouseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCouseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create course section",
      error: error.message,
    });
  }
};

// update section handler
exports.updateSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, sectionId } = req.body;

    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // udpate section
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update course section",
      error: error.message,
    });
  }
};

// delete section handler
exports.deleteSection = async (req, res) => {
  try {
    // data fetch from the params
    const { sectionId } = req.params;

    // delete the section
    await Section.findByIdAndDelete(sectionId);
    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete course section",
      error: error.message,
    });
  }
};
