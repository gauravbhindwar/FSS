"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiSearch, FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { get } from "http";
import { FiPrinter } from "react-icons/fi";

const UserManagementDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Fetch users from API
  const fetchUsers = async (MUJid) => {
    try {
      const response = await axios.get("/api/admin/manageUser", {
        params: { MUJid },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // Debounce delay of 300ms
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = async (mujid) => {
    try {
      const response = await axios.get("/api/form", {
        params: { mujid },
      });
      setSelectedUser(response.data.forms);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error fetching form details:", error);
    }
  };

  const getReportPrint = async (selectedUserForms) => {
    try {
      // Fetch the template from assets
      const templateResponse = await axios.get("/assets/reportTemplate.html");
      const template = templateResponse.data;

      // Use the selectedUserForms state for the report data
      const reportData = selectedUserForms;

      // Fetch the report data for the specific user from the API
      const reportResponse = await axios.post("/api/form/generateReport", {
        mujid: reportData[0].mujid,
      });
      const userReportData = reportResponse.data;

      // Compile the template using Handlebars
      const compiledTemplate = Handlebars.compile(template);

      // Generate the report by replacing placeholders in the template with actual data
      const reportHtml = compiledTemplate({ forms: [userReportData] });

      // Open the generated report in a new window and trigger the print dialog
      const printWindow = window.open("", "_blank");
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Error Printing Form:", error);
    }
  };


  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  const usersWithFormFilled = users.filter((user) => user.isFormFilled);
  const usersWithoutFormFilled = users.filter((user) => !user.isFormFilled);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        User Management Dashboard
      </h1>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search by MUJid or Email"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-4 pl-12 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-label="Search users by MUJid or Email"
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Users with Filled Forms */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Users with Filled Forms
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MUJid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersWithFormFilled.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{user.mujid}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1" /> Filled
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUserClick(user.mujid)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300"
                      >
                        Open
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users without Filled Forms */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Users without Filled Forms
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MUJid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersWithoutFormFilled.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap">{user.mujid}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiXCircle className="mr-1" /> Not Filled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Centered Popup */}
      <AnimatePresence>
  {isPopupOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
    >
      <div className="relative w-full max-w-md p-6 mx-auto my-8 bg-white rounded-lg shadow-xl">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
            onClick={closePopup}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Information */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 mr-4 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-800">
            {selectedUser?.Name
              ? selectedUser.Name
                  .split(" ")
                  .map((word) => word[0].toUpperCase())
                  .join("")
              : "UN"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedUser?.Name || "User Name"}
            </h2>
            <p className="text-sm text-gray-600">
              {selectedUser?.email || "user@example.com"}
            </p>
          </div>
        </div>

        {/* MujId Section */}
        <div className="p-4 mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg">
          <p className="text-white">mujId: {selectedUser.mujid}</p>
        </div>

        {/* Course Details */}
        {selectedUser?.allSelectedCourses && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Selected Courses
            </h3>
            <div className="space-y-4 mb-6">
              {Object.entries(selectedUser.allSelectedCourses).map(
                ([semester, courses], idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Semester {semester}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-r">
                        <h5 className="font-medium text-blue-500">Lab Course</h5>
                        <p className="text-gray-700">
                          {courses.labCourses
                            ? courses.labCourses
                            : "No lab course selected"}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-500">
                          Theory Course
                        </h5>
                        <p className="text-gray-700">
                          {courses.theoryCourses
                            ? courses.theoryCourses
                            : "No theory course selected"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
            <p className="mb-2">
              <strong>Term:</strong> {selectedUser?.isEven ? "Even" : "Odd"}
            </p>
          </>
        )}

        {/* Close Button */}
        <div className="flex justify-around">
          <motion.button
            className="px-4 py-2 flex text-sm items-center font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={closePopup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiXCircle className="mr-2" />
            Close
          </motion.button>
          <motion.button
            className="px-4 flex py-2 items-center text-sm font-medium text-white bg-green-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={() => getReportPrint(selectedUser)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPrinter className="mr-2" />
            Print Form
          </motion.button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>






    </div>
  );
};

export default UserManagementDashboard;
