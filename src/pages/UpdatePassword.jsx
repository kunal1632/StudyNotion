import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { IoEyeOffSharp, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI";

const UpdatePassword = () => {
  const { loading } = useSelector((state) => state.auth);
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
    const token = location.pathname.split("/").at[-1];
    dispatch(resetPassword(password, confirmPassword, token));
  };
  return (
    <div className="text-white">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div>
          <h1>Choose New Passowrd</h1>
          <p>Almost done. Enter your new password and youre all set.</p>
          <form onSubmit={handleOnSubmit}>
            <label>
              <p>New Password</p>
              <input
                required
                type={showPassowrd ? "text" : "password"}
                name="password"
                value={password}
                onChange={changeHandler}
                placeholder="Password"
                className="w-full p-6 bg-richblack-600 text-pure-greys-5"
              />
              <span onClick={() => setShowPassowrd((prev) => !prev)}>
                {showPassowrd ? (
                  <IoEyeOffSharp fontSize={24} />
                ) : (
                  <IoEyeOff fontSize={24} />
                )}
              </span>
            </label>

            <label>
              <p>Confirm New Password</p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={changeHandler}
                placeholder="Confirm password"
                className="w-full p-6 bg-richblack-600 text-pure-greys-5"
              />
              <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                {showPassowrd ? (
                  <IoEyeOffSharp fontSize={24} />
                ) : (
                  <IoEyeOff fontSize={24} />
                )}
              </span>
            </label>

            <button type="submit">Reset Password</button>
          </form>
          <div>
            <Link to={"/login"}>
              <p>Back to login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
