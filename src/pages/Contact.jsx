import React from "react";
import ContactUsForm from "../components/core/ContactPage/ContactUsForm";
import ContactDetials from "../components/core/ContactPage/ContactDetials";

const Contact = () => {
  return (
    <div>
      <div className="flex justify-center gap-10 mt-16">
        <div>
          <ContactDetials />
        </div>

        <div className="border border-richblack-600 p-10 rounded-md">
          <ContactUsForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
