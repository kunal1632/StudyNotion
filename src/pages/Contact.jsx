import React from "react";
import ContactUsForm from "../components/core/ContactPage/ContactUsForm";
import ContactDetials from "../components/core/ContactPage/ContactDetials";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";

const Contact = () => {
  return (
    <div>
      <div className="flex justify-center gap-14 mt-16">
        <div className="lg:w-[25%]">
          <ContactDetials />
        </div>

        <div className="border border-richblack-600 p-10 rounded-md lg:w-[35%] flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-richblack-25">
            Got a Idea? We’ve got the skills. Let’s team up
          </h2>
          <p className="text-sm text-richblack-300 ">
            Tall us more about yourself and what you’re got in mind.
          </p>
          <ContactUsForm />
        </div>
      </div>

      <div className="relative mx-auto my-20  w-11/12 max-w-maxContent bg-richblack-900 text-white">
        <h2 className="text-4xl mt-8 font-semibold text-center">
          Reviews from other learners
        </h2>
        {/* <ReviewSlider/> */}
        <ReviewSlider />
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
