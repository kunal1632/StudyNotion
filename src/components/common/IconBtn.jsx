import React from "react";

const IconBtn = ({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customeClasses,
  type,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`flex items-center ${
        outline ? "border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 transition-all duration-200  hover:opacity-90 ${customeClasses}`}
    >
      {children ? (
        <>
          <span className={`${outline && "text-yellow-50"}`}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default IconBtn;
