import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
import { MdAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { BiRightArrow } from "react-icons/bi";
import { setEditCourse, setStep } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetialsAPI";
import { PiSelectionInverseDuotone } from "react-icons/pi";

const CourseBuilderForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [editSectionName, setEditSectionName] = useState(null);
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("SectionName", "");
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };
  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.errors("Please add atleast one section");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add at least one lecture in each section");
      return;
    }

    // if every thing is good
    dispatch(setStep(3));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if (editSectionName) {
      // we are editing the seciton name
      result = await updateSection(
        {
          sectionName: DataTransfer.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }
  };
  return (
    <div>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Section Name</label>
          <input
            id="sectionName"
            placeholder="Add Section Name"
            {...register("sectionName", { required: true })}
            className="w-full"
          />
          {errors.sectionName && <span>Section Name is required</span>}
        </div>
        <div className="flex w-full">
          <IconBtn
            type="Submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            customeClasses={"text-white"}
          >
            <MdAddCircleOutline className="text-yellow-50" size={20} />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline ml-10"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* {course.courseContent.length > 0 && <NestedView />} */}

      <div className="flex justify-end gap-x-3">
        <button
          className="text-white rounded-md cursor-pointer "
          onClick={goBack}
        >
          Back
        </button>
        <IconBtn text="Next" onClick={goToNext}>
          <BiRightArrow />
        </IconBtn>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
