import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaClockRotateLeft } from "react-icons/fa6";
import { sendOtp, signup } from "../services/operations/authAPI";

const VerifyEmail = () => {
  const { signupData, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;
    dispatch(
      signup(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };
  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="flex gap-2 flex-col max-w-[500px] p-4">
          <h1 className="text-richblack-5 text-3xl">Verify Email</h1>
          <p className="text-richblack-50 text-lg">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleOnSubmit}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            )
            <button
              className="text-richblack-900 bg-yellow-100 rounded-md mt-7 w-full py-3 px-3"
              type="submit"
            >
              Verify Email
            </button>
          </form>

          <div className="flex justify-between mt-3">
            <Link to={"/login"}>
              <p className="flex gap-3 items-center text-richblack-100 text-sm p-1">
                <FaArrowLeftLong /> Back to login
              </p>
            </Link>
            <button
              className="text-[#47A5C5] flex gap-2 cursor-pointer items-center"
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
            >
              <FaClockRotateLeft />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
