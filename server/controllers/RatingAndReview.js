const RatingAndReviews = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// create reating
exports.createRating = async (req, res) => {
  try {
    // fetch user id
    // fetchdata from body
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;
    console.log(courseId);

    // check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }
    // check if user already reviewed the course
    const alreadyREviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyREviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }
    // create rating and reviews
    const ratingReview = await RatingAndReviews.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update course
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { ratingAndReviews: ratingReview._id },
      },
      { new: true }
    );
    console.log(updatedCourseDetails);
    // return resposne
    return res.status(200).json({
      success: true,
      message: "rating and review created successfully",
      ratingReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get average rating
exports.getAverageRating = async (req, res) => {
  try {
    // get course id
    const courseId = req.body.courseId;
    // calculate average rating

    const result = await RatingAndReviews.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: { _id: null, averageRating: { $avg: "$rating" } },
      },
    ]);

    // return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // if not reating /review
    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no rating given till now",
      averageRating: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all rating

exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReviews.find({})
      .sort({ rating: "desc" })
      .populate({ path: "User", select: "FirstName lastName email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
