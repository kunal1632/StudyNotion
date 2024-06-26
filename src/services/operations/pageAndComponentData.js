import React from "react";
import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";
import toast from "react-hot-toast";

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const resposne = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId }
    );

    if (!resposne?.data?.success) {
      throw new Error("Could not fetch category page data");
    }
    result = resposne?.data;
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};
