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
import dynamic from "next/dynamic";
import SVGShuffle from "@/app/verify-email/loader";

// Dynamically import html2pdf with ssr: false to avoid window is not defined error
const Html2Pdf = dynamic(() => import("html2pdf.js"), { ssr: false });

const UserManagementDashboard = () => {
  // State declarations will go here
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
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch]);

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
      console.error("Error fetching form details:", error);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  // handlePrint function will be added in the next part
  const handlePrint = () => {
    if (selectedUser && typeof window !== "undefined") {
      const content = document.createElement("div");
      content.innerHTML = `
        <style>
          /* Add your PDF styles here */
        </style>

        <div class="container">
          <div class="header">
            <h1>${selectedUser.Name || "User"} Details</h1>
          </div>
          
          <div class="user-info">
            <div class="user-info-item">
              <h3>Personal Info</h3>
              <p><strong>Name:</strong> ${selectedUser.Name || "N/A"}</p>
              <p><strong>Email:</strong> ${selectedUser.email || "N/A"}</p>
              <p><strong>Phone:</strong> ${selectedUser.phone || "N/A"}</p>
            </div>
            <div class="user-info-item">
              <h3>Academic Info</h3>
              <p><strong>MUJId:</strong> ${selectedUser.mujid || "N/A"}</p>
              <p><strong>Term:</strong> ${
                selectedUser.isEven ? "Even" : "Odd"
              }</p>
              ${Object.entries(selectedUser)
                .filter(
                  ([key, value]) =>
                    ![
                      "Name",
                      "email",
                      "mujid",
                      "isEven",
                      "allSelectedCourses",
                      "createdAt",
                    ].includes(key) && typeof value !== "object"
                )
                .map(
                  ([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`
                )
                .join("")}
            </div>
          </div>

          <div class="courses-container">
            <h2>Selected Courses</h2>
            ${Object.entries(selectedUser.allSelectedCourses || {})
              .map(
                ([semester, courses]) => `
                <h3 class="semester-title">Semester: ${semester}</h3>
                <table>
                  <tr>
                    <th>Course Type</th>
                    <th>Course</th>
                  </tr>
                  <tr>
                    <td>Lab Course</td>
                    <td>${courses.labCourses || "No lab course selected"}</td>
                  </tr>
                  <tr>
                    <td>Theory Course</td>
                    <td>${
                      courses.theoryCourses || "No theory course selected"
                    }</td>
                  </tr>
                </table>
              `
              )
              .join("")}
          </div>
        </div>
      `;

      const opt = {
        margin: 7,
        filename: `${selectedUser.Name || "User"}_Form.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      Html2Pdf().from(content).set(opt).save();
    }
  };

  const usersWithFormFilled = filteredUsers.filter((user) => user.isFormFilled);
  const usersWithoutFormFilled = filteredUsers.filter(
    (user) => !user.isFormFilled
  );

  // Return statement will be added in the next part
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
                      {/* User card content */}
                    </div>
                  ))}
                </div>

                {/* Desktop and Tablet Table Layout */}
                <div className="hidden xl:block">
                  <table className="w-full text-sm sm:text-base">
                    {/* Table header and body */}
                  </table>
                </div>
              </div>
            </div>

            {/* Users without Filled Forms */}
            <div>{/* Similar structure as Users with Filled Forms */}</div>
          </div>

          {/* Popup for selected user */}
          <AnimatePresence>
            {isPopupOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                {/* Popup content */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default UserManagementDashboard;
