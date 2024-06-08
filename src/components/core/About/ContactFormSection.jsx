import React from "react";
import ContactUsForm from "../ContactPage/ContactUsForm";

const ContactFormSection = () => {
  return (
    <div className="mx-auto border-[1px] border-richblack-700 p-10 w-[55%] rounded-lg mt-32">
      <h1 className="text-center text-4xl font-semibold">Get in Touch</h1>
      <p className="text-center text-richblack-300 mt-3">
        We&apos;d love to here for you, Please fill out this form.
      </p>

      <div className="mt-12 mx-auto">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
