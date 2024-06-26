import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../services/operations/authAPI";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, password } = formData;

  function submitHandler(event) {
    event.preventDefault();
    dispatch(login(email, password, navigate));
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col w-full gap-y-4 mt-6"
    >
      <label className="w-full">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="email"
          value={formData.email}
          onChange={changeHandler}
          placeholder="Enter Email Address"
          name="email"
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
        ></input>
      </label>
      <label className="w-full relative">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Passeord <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={changeHandler}
          placeholder="Enter Password"
          name="password"
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
        ></input>

        <span
          className="absolute right-3 top-[38px] cursor-pointer "
          onClick={() => {
            setShowPassword((prev) => !prev);
          }}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible
              fontSize={24}
              fill="#afb2bf"
            ></AiOutlineEyeInvisible>
          ) : (
            <AiOutlineEye fontSize={24} fill="#afb2bf"></AiOutlineEye>
          )}
        </span>

        <Link to="/forgot-password">
          <p className="text-xs mt-1 text-blue-100 max-w-max ml-auto">
            Forgot Password
          </p>
        </Link>
      </label>

      <button
        type="submit"
        className="bg-yellow-50 rounded-[8px] text-richblack-900 font-medium px-[12px] py-[8px] mt-6"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
