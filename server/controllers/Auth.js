const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const passwordUpdated = require("../mail/templates/passwordUpdate");
require("dotenv").config();

// sendOTP
exports.sendotp = async (req, res) => {
  try {
    // fetch emal from rquest body
    const { email } = req.body;

    //   check is user already exits
    const checkUserPresent = await User.findOne({ email });

    //   if user already exit, then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //   generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    console.log("Otp generated: ", otp);

    const otpPayload = { email, otp };

    // create an entry for otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return response successful
    res.status(200).json({
      success: true,
      message: "otp sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while generating otp",
    });
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    // data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword does not match",
      });
    }
    // check user already exist or not
    const exisitingUser = await User.findOne({ email });
    if (exisitingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }
    // find most recent otp stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("----------------------", recentOtp);
    // validate otp
    if (recentOtp.length == 0) {
      // otp not found
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      // invalid otp
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create entry in db
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    // reutrn response
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be register. Something went wrong",
    });
  }
};
// login
exports.login = async (req, res) => {
  try {
    // get Data from req body
    const { email, password } = req.body;
    // validating the data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Email and password both are required",
      });
    }
    // user check exist
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registerd, please signup first",
      });
    }
    // match password and generate jwt
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failed. please try again",
    });
  }
};
// change password
exports.changePassword = async (req, res) => {
  try {
    // get data from req body
    const { oldPassowrd, newPassword, confirmNewPassword, email } = req.body;

    // check oldPassword, newPassowrd, confirmNewPassword
    if ((!oldPassowrd || !newPassword || !confirmNewPassword, email)) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //   checking newPassword and confirmPassword
    if (newPassword !== confirmNewPassword) {
      return res.status(401).json({
        success: false,
        message: "Password and confirm passowrd does not matched",
      });
    }

    // user check exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not found",
      });
    }
    //   validation old password
    if (!(await bcrypt.compare(oldPassowrd, user.password))) {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
    //   hash new passowrd
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password in db
    const updatedUserDetails = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    //   send mail - password update
    const emailResponse = await mailSender(
      updatedUserDetails.email,
      "Password for your account has been updated",
      passwordUpdated(
        updatedUserDetails.email,
        `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
      )
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while changing the password",
    });
  }
};
