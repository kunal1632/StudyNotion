const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;
  try {
    // check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" });
    }

    // find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      coureId: courseId,
      userId: UserId,
    });

    if (!courseProgress) {
      // if course progress doen't exist create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress does not exist",
      });
    } else {
      // if coruse progress exitst, check fi the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" });
      }
      //   push the subsection into the completed videos array
      courseProgress.completedVideos.push(subsectionId);
    }
    // save the udpated course progress
    await courseProgress.save();
    return res.status(200).json({ message: "Course progress updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
