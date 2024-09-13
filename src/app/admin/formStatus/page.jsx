"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiPrinter,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
// import Handlebars from "handlebars";
// import html2pdf from "html2pdf.js";
import SVGShuffle from "@/app/verify-email/loader";

const UserManagementDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/manageUser");
      setUsers(response.data.users || []);
      setFilteredUsers(response.data.users || []);
      console.log(response.data.users);
    } catch (error) {
      // console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Cookies:", document.cookie);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // Debounce delay of 300ms
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [debouncedSearch, users]);

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
      // console.error("Error fetching form details:", error);
    }
  };

  // const getReportPrint = async (selectedUser) => {
  //   try {
  //     // Fetch the template from assets
  //     const templateResponse = await axios.get("/assets/reportTemplate.html");
  //     const template = templateResponse.data;

  //     // Use the selectedUserForms state for the report data
  //     const reportData = selectedUser;

  //     // Fetch the report data for the specific user from the API
  //     const reportResponse = await axios.post("/api/form/generateReport", {
  //       mujid: reportData.mujid,
  //     });
  //     const userReportData = reportResponse.data;

  //     // Compile the template using Handlebars
  //     const compiledTemplate = Handlebars.compile(template);

  //     // Generate the report by replacing placeholders in the template with actual data
  //     const reportHtml = compiledTemplate({ forms: [userReportData] });

  //     // Create a temporary element to hold the HTML content
  //     const tempElement = document.createElement("div");
  //     tempElement.innerHTML = reportHtml;

  //     // Use html2pdf to generate and download the PDF
  //     // Add a line on top and bottom of the page
  //     const style = document.createElement("style");
  //     style.innerHTML = `
  //       @page {
  //         size: letter;
  //         margin: 1in;
  //       }
  //       @media print {
  //         .page-break {
  //           display: block;
  //           page-break-before: always;
  //         }
  //       }
  //     `;
  //     tempElement.appendChild(style);

  //     html2pdf()
  //       .from(tempElement)
  //       .set({
  //         margin: 0,
  //         filename: `${selectedUser.Name} Form Report.pdf`,
  //         image: { type: "jpeg", quality: 0.98 },
  //         html2canvas: { scale: 2 },
  //         jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  //       })
  //       .save();
  //   } catch (error) {
  //     // console.error("Error generating report:", error);
  //   }
  // };
  //     };
  //     link.href = URL.createObjectURL(
  //       new Blob([reportHtml], { type: "text/html" })
  //     );
  //     link.download = `${selectedUser.name}.pdf`;
  //     link.click();
  //     URL.revokeObjectURL(link.href);
  //   } catch (error) {
  // console.error("Error Printing Form:", error);
  //   }
  // };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  const usersWithFormFilled = filteredUsers.filter((user) => user.isFormFilled);
  const usersWithoutFormFilled = filteredUsers.filter(
    (user) => !user.isFormFilled
  );

  return (
    <>
    {loading ? (
      <SVGShuffle />
    ) : (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
            User Management Dashboard
          </h1>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8 relative">
            <input
              type="text"
              placeholder="Search by MUJid or Email"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 sm:p-4 pl-10 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
              aria-label="Search users by MUJid or Email"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Users with Filled Forms */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                Users with Filled Forms
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Mobile and Tablet Card Layout */}
                <div className="block xl:hidden">
                  {usersWithFormFilled.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 m-2 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-150 ease-in-out">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 mr-3 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-800">
                          {user.name
                            .split(" ")
                            .map((word) => word[0].toUpperCase())
                            .join("")}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1" /> Filled
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUserClick(user.mujid)}
                          className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 text-sm">
                          Open
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop and Tablet Table Layout */}
                <div className="hidden xl:block">
                  <table className="w-full text-sm sm:text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MUJid
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersWithFormFilled.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                          <td className="px-4 py-2 whitespace-nowrap">
                            {user.mujid}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {user.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheckCircle className="mr-1" /> Filled
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleUserClick(user.mujid)}
                              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 text-sm">
                              Open
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Users without Filled Forms */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                Users without Filled Forms
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Mobile and Tablet Card Layout */}
                <div className="block xl:hidden">
                  {usersWithoutFormFilled.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 m-2 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-150 ease-in-out">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 mr-3 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-800">
                          {user.name
                            .split(" ")
                            .map((word) => word[0].toUpperCase())
                            .join("")}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiXCircle className="mr-1" /> Not Filled
                      </span>
                    </div>
                  ))}
                </div>

                {/* Desktop and Tablet Table Layout */}
                <div className="hidden xl:block">
                  <table className="w-full text-sm sm:text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MUJid
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersWithoutFormFilled.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                          <td className="px-4 py-2 whitespace-nowrap">
                            {user.mujid}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {user.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
          </div>

          {/* Centered Popup */}
          <AnimatePresence>
            {isPopupOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="relative w-full max-w-md p-4 sm:p-6 mx-auto bg-white rounded-lg shadow-xl">
                  <div className="absolute top-2 right-2">
                    <button
                      className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
                      onClick={closePopup}>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
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
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4 rounded-full bg-gray-200 flex items-center justify-center text-xl sm:text-2xl font-bold text-gray-800">
                      {selectedUser?.Name
                        ? selectedUser.Name.split(" ")
                            .map((word) => word[0].toUpperCase())
                            .join("")
                        : "UN"}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                        {selectedUser?.Name || "User Name"}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {selectedUser?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>

                  {/* MujId Section */}
                  <div className="p-2 sm:p-4 mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg">
                    <p className="text-white text-sm sm:text-base">
                      mujId: {selectedUser.mujid}
                    </p>
                  </div>

                  {/* Course Details */}
                  {selectedUser?.allSelectedCourses && (
                    <>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                        Selected Courses
                      </h3>
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        {Object.entries(selectedUser.allSelectedCourses).map(
                          ([semester, courses], idx) => (
                            <motion.div
                              key={idx}
                              className="p-3 sm:p-4 bg-gray-100 rounded-lg shadow-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}>
                              <h4 className="text-sm sm:text-base font-semibold text-gray-700">
                                Semester: {semester}
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border-r">
                                  <h5 className="font-medium text-blue-500">
                                    Lab Course
                                  </h5>
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
                      <p className="text-sm sm:text-base mb-2">
                        <strong>Term:</strong>{" "}
                        {selectedUser?.isEven ? "Even" : "Odd"}
                      </p>
                    </>
                  )}

                  {/* Close and Print Buttons */}
                  <div className="flex justify-around">
                    <motion.button
                      className="px-3 py-2 text-sm flex items-center font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      onClick={closePopup}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <FiXCircle className="mr-2" />
                      Close
                    </motion.button>
                    <motion.button
                      className="px-3 py-2 text-sm flex items-center font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      onClick={() => {
                        console.log("Print button clicked");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <FiPrinter className="mr-2" />
                      Print Form
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    )
        
    }
    </>
  );
};

export default UserManagementDashboard;
