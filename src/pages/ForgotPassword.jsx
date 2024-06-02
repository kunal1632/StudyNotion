import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getPasswordRestToken } from "../services/operations/authAPI";

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
    <div className="text-white flex justify-center items-center">
      <div>
        {loading ? (
          <div>Loading....</div>
        ) : (
          <div>
            <h1>{!emailSent ? "Reset your password" : "Check Your Email"}</h1>
            <p>
              {!emailSent
                ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                : `We have sent the reset email to ${email}`}
            </p>

            <form onSubmit={submitHandler}>
              {!emailSent && (
                <label>
                  <p>Email Address*</p>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email Address"
                  />
                </label>
              )}
              <button type="submit">
                {!emailSent ? "Reset Password" : "Resend Email"}
              </button>
            </form>
            <div>
              <Link to={"/login"}>
                <p>Back to login</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
