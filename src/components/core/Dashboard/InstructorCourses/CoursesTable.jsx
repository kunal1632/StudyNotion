import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetialsAPI";
import { useNavigate } from "react-router-dom";

const CoursesTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };
  return (
    <div className="text-white">
      <Table>
        <Thead>
          <Tr>
            <Th>Courses</Th>

            <Th>Duration</Th>

            <Th>Price</Th>

            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td>No Courses Found</Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-richblack-800 p-8"
              >
                <Td className="flex gap-x-4">
                  <img
                    src={course?.thumbnail}
                    className="h-[150px] rounded-lg object-cover"
                    alt="thumbnail"
                  />
                  <div className="flex flex-col">
                    <p>{course.courseName}</p>
                    <p>{course.courseDescription}</p>
                    <p>Created: </p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="text-pink-300">DRAFTED</p>
                    ) : (
                      <p className="text-yellow-50">PUBLISHED</p>
                    )}
                  </div>
                </Td>

                <Td>2hr 30min</Td>
                <Td>${course.price}</Td>

                <Td>
                  <button
                    className=""
                    onClick={() =>
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }
                    disabled={loading}
                  >
                    EDIT
                  </button>
                  <button
                    className=""
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data realted to this course will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }
                    disabled={loading}
                  >
                    DELETE
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CoursesTable;
