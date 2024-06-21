import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

const ChipInput = ({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValue,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);

  //   setting up state for managing chips array
  const [chips, setChips] = useState([]);

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag);
    }
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  }, []);

  const handleKeyDown = (event) => {
    // check if user press "enter" or ","
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      //   get input value and remove extra space
      const chipValue = event.target.value.trim();
      //   check is the input value is already in array
      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue];
        setChips(newChips);
        event.target.value = "";
      }
    }
  };

  //   function to handle deleteion of a chips
  const handlDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex);
    setChips(newChips);
  };

  useEffect(() => {
    setValue(name, chips);
  }, [chips]);
  return (
    <div className="flex flex-col space-y-2">
      {/* render the label for the input */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label}
        <sup className="text-pink-200">*</sup>
      </label>
      {/* render the chips and input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {/* map over the chips array and render each chip */}
        {chips.map((chip, index) => (
          <div
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
            key={index}
          >
            {/* render the chip value */}
            {chip}
            {/* render the button to dlete the chip */}
            <button
              type="button"
              onClick={() => handlDeleteChip(index)}
              className="ml-2 focus:outline-none "
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        {/* render the input for adding new chips */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>
      {/* render error */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default ChipInput;
