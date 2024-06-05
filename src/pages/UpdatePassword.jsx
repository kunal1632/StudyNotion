import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI";
import { FaArrowLeftLong } from "react-icons/fa6";

const UpdatePassword = () => {
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassowrd, setShowPassowrd] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changeHandler = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const { password, confirmPassword } = formData;

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token, navigate));
  };
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="flex flex-col gap-3">
          <h1 className="text-white text-3xl font-semibold">
            Choose New Password
          </h1>
          <p className="text-richblack-50">
            Almost done. Enter your new password and youre all set.
          </p>
          <form onSubmit={handleOnSubmit}>
            <label className="text-richblack-50 relative">
              <p className="mb-1 ">
                New Password<span className="text-pink-200">*</span>
              </p>
              <input
                required
                type={showPassowrd ? "text" : "password"}
                name="password"
                value={password}
                onChange={changeHandler}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-md bg-richblack-800 text-pure-greys-5"
              />
              <span
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                onClick={() => setShowPassowrd((prev) => !prev)}
              >
                {showPassowrd ? (
                  <LuEyeOff fontSize={24} />
                ) : (
                  <LuEye fontSize={24} />
                )}
              </span>
            </label>

            <label className="text-richblack-50 relative">
              <p className="text-richblack-25 mt-3 mb-1">
                Confirm New Password<span className="text-pink-200">*</span>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={changeHandler}
                placeholder="Confirm password"
                className="w-full px-4 py-3 rounded-md bg-richblack-800 text-pure-greys-5"
              />
              <span
                className="absolute right-3 top-[85px] z-[10] cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <LuEyeOff fontSize={24} />
                ) : (
                  <LuEye fontSize={24} />
                )}
              </span>
            </label>

            <button
              className="text-richblack-900 bg-yellow-100 rounded-md mt-7 w-full py-2 px-3"
              type="submit"
            >
              Reset Password
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
  );
};

export default UpdatePassword;
