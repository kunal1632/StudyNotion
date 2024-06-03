import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getPasswordRestToken } from "../services/operations/authAPI";
import { FaArrowLeftLong } from "react-icons/fa6";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getPasswordRestToken(email, setEmailSent));
  };
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="w-1/4  p-5">
        {loading ? (
          <div>Loading....</div>
        ) : (
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold  text-richblack-5">
              {!emailSent ? "Reset your password" : "Check Your Email"}
            </h1>
            <p className="text-richblack-200 mb-2">
              {!emailSent
                ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                : `We have sent the reset email to ${email}`}
            </p>

            <form onSubmit={submitHandler} className="flex flex-col">
              {!emailSent && (
                <label>
                  <p className="text-richblack-50 mb-1 text-sm">
                    Email Address<span className="text-pink-200">*</span>
                  </p>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email Address"
                    className="bg-richblack-700 px-3 py-2 w-full rounded-md text-richblack-25"
                  />
                </label>
              )}
              <button
                type="submit"
                className="text-richblack-900 bg-yellow-100 rounded-md mt-7 w-full py-2 px-3"
              >
                {!emailSent ? "Reset Password" : "Resend Email"}
              </button>
            </form>
            <div>
              <Link to={"/login"}>
                <p className="flex gap-3 items-center text-richblack-100 text-sm p-1">
                  <FaArrowLeftLong /> Back to login
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
