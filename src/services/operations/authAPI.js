import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { isRouteErrorResponse } from "react-router-dom";

const {
  SENDDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDDOTP_API, {
        email,
        checkUerPresent: true,
      });
      console.log("SENDOTP API RESPONSE.....", response);
      console.log(response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Otp sent successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("Error in sendotp api", error);
      toast.error("Could not send otp");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signup(
  accountType,
  firstName,
  lastName,
  email,
  passowrd,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        passowrd,
        confirmPassword,
        otp,
      });
      console.log("SIGNUP API RESPONSE........", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup successfully");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR......", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
export function login(email, passowrd, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        passowrd,
      });
      console.log("Login API RESPONSE........", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup successfully");
      const userImage = response?.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(resetCart.data.user));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR......", error);
      toast.error("LOGIN Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

export function getPasswordRestToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });
      console.log("RESET PASSWORD TOKEN API RESPONSE.....", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Email sent successfully");
      setEmailSent(true);
    } catch (error) {
      console.log("REst password token error", error);
      toast.error("Could not send email");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESET PASSWORD RESPONSE....", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password has been reset successfully");
    } catch (error) {
      console.log("RESET PASSWORD ERROR", error);
      toast.error("Failed to rest your password, please try again");
    }
    dispatch(setLoading(false));
  };
}
