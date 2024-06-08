import React from "react";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { CiLink } from "react-icons/ci";

const ContactDetials = () => {
  return (
    <div className="flex flex-col gap-5 p-10 bg-richblack-800 rounded-xl">
      <div className="flex gap-3">
        <HiMiniChatBubbleLeftRight className="text-richblack-200 text-2xl" />
        <div>
          <h2 className="text-richblack-5 font-bold text-lg">Chat With Us</h2>
          <p className="text-richblack-300">
            Our firendly team is here to help
          </p>
          <p className="text-richblack-300">kunal.dk35@gmail.com</p>
        </div>
      </div>

      <div className="flex gap-3">
        <BsGlobeCentralSouthAsia className="text-richblack-200 text-2xl" />
        <div>
          <h2 className="text-richblack-5 font-bold text-lg">Visit us</h2>
          <p className="text-richblack-300">
            Come and say hello to our office HQ.
          </p>
          <p className="text-richblack-300">New Delhi, India</p>
        </div>
      </div>

      <div className="flex gap-3">
        <CiLink className="text-richblack-200 text-2xl" />
        <div>
          <h2 className="text-richblack-5 font-bold text-lg">
            Connect With us
          </h2>
          <p className="text-richblack-300">Linkdin to connect with CEO</p>
          <a
            className="text-richblack-300"
            href="https://www.linkedin.com/in/kunaldhand/"
          >
            linkdin/kunaldhand
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactDetials;
