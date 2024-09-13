"use client";
import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiBook,
  FiFileText,
  FiMenu,
  FiUser,
  FiPrinter,
  FiLogOut,
  FiCalendar,
} from "react-icons/fi";
import { TbLayoutDashboard } from "react-icons/tb";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import axios from "axios";

const AdminDashboard = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState("");
  // const [adminName, setAdminName] = useState();

  const sidebarAnimation = useAnimation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  async function handleLogout() {
    // Add your logout logic here
    try {
      const res = await axios.post("/api/admin/adminLogout");
      if (res.data.success) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCurrentAdmin = async () => {
    try {
      console.log(mujid);
      const response = await axios.get("/api/admin/manageUser", {});
      setCurrentAdmin(response.data.adminName);
    } catch (error) {
      console.error("Error fetching current admin:", error);
    }
  };

  useEffect(() => {
    fetchCurrentAdmin();
  }, []);

  // async function handleSetSemester() {
  //   try {
  //     const res = await axios.post("/api/admin/setSemester");
  //     if (res.data.success) {
  //       console.log("Semester Set Successfully");
  //     }
  //     console.log(res.data);
  //     console.log(res.data.message);
  //     console.log(res.data.error);
  //   } catch (error) {
  //     console.log("Error In Setting Semester");
  //   }
  // }

  // Helper function to get the initials from the user's name

  const userName = currentAdmin || "Guest Admin";
  const userRole = "Administrator";
  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  useEffect(() => {
    let timer;
    if (isSidebarOpen) {
      sidebarAnimation.start({ width: "16rem", transition: { duration: 0.5 } });
      timer = setTimeout(() => setTextVisible(true), 300);
    } else {
      sidebarAnimation.start({ width: "5rem", transition: { duration: 0.5 } });
      setTimeout(() => setTextVisible(false), 500); // Match with the sidebar animation duration
    }

    return () => clearTimeout(timer);
  }, [isSidebarOpen, sidebarAnimation]);

  const closeSidebar = () => {
    setTextVisible(false);
    let timer = setTimeout(() => setIsSidebarOpen(false), 200);
    return () => clearTimeout(timer);
  };

  return (
    <div className="flex h-[fit-content] overflow-hidden w-screen ">
      {/* Sidebar */}
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <div
        className={`w-[5rem] min-h-screen h-[100%] hidden ${
          isSidebarOpen ? `max-md:!inline-block` : ""
        } ${textVisible ? `max-md:!inline-block` : ""}`}></div>
      <motion.div
        className={`bg-white shadow-lg max-md:z-[11] ${
          isSidebarOpen ? `max-md:absolute` : ""
        } ${textVisible ? `max-md:absolute` : ""} max-md:min-h-screen`}
        animate={sidebarAnimation}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => closeSidebar()}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Toggle Sidebar">
            <FiMenu size={24} />
          </button>
          {isSidebarOpen && (
            <motion.h2
              className={`text-xl font-semibold transition-opacity duration-300 ${
                textVisible ? "opacity-100" : "opacity-0"
              }`}>
              Admin Panel
            </motion.h2>
          )}
        </div>
        <div className="flex flex-col items-center mt-8">
          <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-2xl font-bold">
            {getInitials(userName)}
          </div>
          {textVisible && isSidebarOpen && (
            <div
              className={`mt-2 text-center transition-opacity duration-300 ${
                textVisible ? "opacity-100" : "opacity-0"
              }`}>
              <h3 className="font-semibold">{userName}</h3>
              <p className="text-sm text-gray-500">{userRole}</p>
            </div>
          )}
        </div>
        <nav className="mt-8">
          <Link href="/admin">
            <motion.div
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <TbLayoutDashboard className="mr-3 " />
              {textVisible && isSidebarOpen && <span>Dashboard</span>}
            </motion.div>
          </Link>
          <Link href="/admin/manageUser">
            <motion.div
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <FiUser className="mr-3" />
              {textVisible && isSidebarOpen && <span>Manage User</span>}
            </motion.div>
          </Link>
          <Link href="/admin/manageCourse">
            <motion.div
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <FiBook className="mr-3" />
              {textVisible && isSidebarOpen && <span>Manage Course</span>}
            </motion.div>
          </Link>
          <Link href="/admin/formStatus">
            <motion.div
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <FiFileText className="mr-3" />
              {textVisible && isSidebarOpen && <span>Form Status</span>}
            </motion.div>
          </Link>
          <Link href="#">
            <motion.div
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <FiPrinter className="mr-3" />
              {textVisible && isSidebarOpen && <span>Print Form</span>}
            </motion.div>
          </Link>
          <Link href="/admin/setSemester">
            <motion.div
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <FiCalendar className="mr-3" />
              {textVisible && isSidebarOpen && <span>Set Semester</span>}
            </motion.div>
          </Link>
          <Link href="/">
            <motion.div
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={handleLogout}>
              <FiLogOut className="mro-3" />
              {textVisible && isSidebarOpen && <span>Logout</span>}
            </motion.div>
          </Link>
        </nav>
      </motion.div>
      <main className="w-full">{children}</main>
    </div>
  );
};

export default AdminDashboard;
