"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaCode,
  FaGraduationCap
} from "react-icons/fa";
import { animate, motion } from "framer-motion";

const CourseForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    semester: "",
    classification: "",
    courseCode: "",
    courseCredit: "",
    courseType: ""
  });
  const Router = useRouter();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        error =
          value.length > 100 ? "Title must be 100 characters or less" : "";
        break;
      case "courseCode":
        error = !/^[A-Za-z]{3}\d{3}$/.test(value)
          ? "Invalid course code format"
          : "";
        break;
      case "courseCredit":
        error =
          isNaN(value) || value < 0 ? "Credit must be a positive number" : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the API request body with the relevant fields
    const requestBody = {
      title: formData.title,
      description: formData.description,
      forSemester: formData.semester,
      isEven: parseInt(formData.semester) % 2 === 0, // If semester is even, set true
      courseCode: formData.courseCode,
      courseCredit: formData.courseCredit,
      courseClassification: formData.classification,
      courseType: formData.courseType.toUpperCase()
    };

    try {
      // Sending POST request to your API endpoint
      const response = await fetch("/api/admin/manageCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      // Handle response
      if (response.ok) {
        const result = await response.json();
        console.log("Course successfully created:", result);

        // Redirect to another page (optional)
        Router.push("/admin");
      } else {
        console.error("Failed to create course:", response.statusText);
      }
    } catch (error) {
      console.error("Error while creating course:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#E2E8F0] py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-cyan-200 rounded-full flex items-center justify-center">
                <FaGraduationCap className="h-8 w-8 text-cyan-600" />
              </div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Add a New Course</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Enter the details of the new course below.
                </p>
              </div>
            </div>
            <form className="divide-y divide-gray-200" onSubmit={handleSubmit}>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose" htmlFor="title">
                    Course Title
                  </label>
                  <div className="relative text-gray-400">
                    <FaBook className="absolute left-3 top-3" />
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className={`pl-10 pr-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.title ? "border-red-500" : ""
                      }`}
                      placeholder="Enter the course title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose" htmlFor="description">
                    Course Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Provide a detailed overview of the course"
                    value={formData.description}
                    onChange={handleChange}></textarea>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose" htmlFor="semester">
                    Semester
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                    <select
                      id="semester"
                      name="semester"
                      className="pl-10 pr-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      value={formData.semester}
                      onChange={handleChange}
                      required>
                      <option value="">Select Semester</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="7">7</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Classification</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="classification"
                        value="THEORY"
                        checked={formData.classification === "THEORY"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-gray-600"
                      />
                      <span className="ml-2 text-gray-700">Theory</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="classification"
                        value="LAB"
                        checked={formData.classification === "LAB"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-gray-600"
                      />
                      <span className="ml-2 text-gray-700">Lab</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose" htmlFor="courseCode">
                    Course Code
                  </label>
                  <div className="relative text-gray-400">
                    <FaCode className="absolute left-3 top-3" />
                    <input
                      type="text"
                      id="courseCode"
                      name="courseCode"
                      className={`pl-10 pr-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.courseCode ? "border-red-500" : ""
                      }`}
                      placeholder="CSE101"
                      value={formData.courseCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.courseCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.courseCode}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose" htmlFor="courseCredit">
                    Course Credit
                  </label>
                  <div className="relative text-gray-400">
                    <FaClock className="absolute left-3 top-3" />
                    <input
                      type="number"
                      id="courseCredit"
                      name="courseCredit"
                      className={`pl-10 pr-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.courseCredit ? "border-red-500" : ""
                      }`}
                      placeholder="3"
                      value={formData.courseCredit}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      required
                    />
                  </div>
                  {errors.courseCredit && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.courseCredit}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose" htmlFor="courseType">
                    Course Type
                  </label>
                  <select
                    id="courseType"
                    name="courseType"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={formData.courseType}
                    onChange={handleChange}
                    required>
                    <option value="">Select Course Type</option>
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <motion.button
                  type="button"
                  className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                  whileHover={{ scale: 1.11 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => history.back()}>
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  whileHover={{ scale: 1.11 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  whileTap={{ scale: 0.95 }}>
                  Create
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div className="absolute top-0 left-0 w-[100vw] overflow-hidden min-h-screen opacity-50 z-[-1]">
        <img
          src="/MUJ-homeCover.jpg"
          alt="image-muj"
          className="w-full min-h-screen object-cover"
        />
      </div> */}
    </div>
  );
};

export default CourseForm;
