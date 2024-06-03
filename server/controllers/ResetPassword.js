const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// rest passowrd token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;

    // check user for this email, email validation
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "You email is not registered with us",
      });
    }

    //generate token
    const token = crypto.randomUUID();

    //   update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    //   send mail contianing the url
    await mailSender(email, "Password Rest Link", `Password Rest Link: ${url}`);

    // return response
    return res.json({
      success: true,
      message:
        "Email sent successfully, please check email and change your password",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong while sending reset password link",
    });
  }
};

// reset password

exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Passowrd not matching",
      });
    }
    // get user details from db using token
    const userDetails = await User.findOne({ token: token });
    // if no entry - invalid token
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Token is invalid",
      });
    }
    // check token time
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: "Link is expired, please try again",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // update passowrd in user model
    await User.findOneAndUpdate({ token: token }, { password: hashedPassword });
    // return response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "rest password failed ",
    });
  }
};
