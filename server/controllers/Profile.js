const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// update profile handler
exports.updateProfile = async (req, res) => {
  try {
    // get data from the body
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    // get user id
    const id = req.user.id;

    // find profile
    const userDetail = await User.findById(id);
    const profileDetails = await Profile.findById(userDetail.additionalDetails);

    const user = await User.findByIdAndUpdate(id, { firstName, lastName });
    await user.save();

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot update the profile details",
    });
  }
};

// account delete handler

exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;
    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not fount",
      });
    }
    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    // TODO: unenrolled user from all the enrolled courses

    // delete profile
    await User.findByIdAndDelete({ _id: id });

    // return resposne
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the user ",
    });
  }
};

// get all user details
exports.getAllUserDetails = async (req, res) => {
  try {
    // get user id
    const id = req.user.id;

    // validation and get user detials
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return response

    return res.status(200).json({
      success: true,
      message: "Fetched all user data successfully",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot fetch user data",
    });
  }
};

// update display picture

exports.updateDisplayPicture = async (req, res) => {
  try {
    // get user id and image file
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    // upload image to cloudinary
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);

    // update pic in user model
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
