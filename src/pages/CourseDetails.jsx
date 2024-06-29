import React from "react";

const CourseDetails = () => {
  const handleBuyCourse = () => {
    if (token) {
      buyCourse();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <button onClick={() => handleBuyCourse()} className="bg-yellow-50 p-6">
        Buy Now
      </button>
    </div>
  );
};

export default CourseDetails;
