"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaIdCard, FaUserShield, FaUserMinus, FaPhone, FaBriefcase } from "react-icons/fa";


export default function AdminForm() {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mujid, setMujid] = useState("");
  const [phone, setPhone] = useState(null); // New state for phone
  const [designation, setDesignation] = useState(null); // New state for designation
  const [deletePop, setDeletePop] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  const toggleDeletePop = () => {
    setDeletePop(!deletePop);
  };

  const handleDelete = async (mujid) => {
    setLoader(true);
    try {
      const res = await fetch("/api/admin/manageUser", {
        method: "DELETE",
        body: JSON.stringify({ mujid }),
        // headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      } else {
        setDeletePop(false);
      }
    } catch (error) {
      console.error("Error in API call:", error);
      // setMessage("An error occurred. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/manageUser", {
        method: "POST",
        body: JSON.stringify({ email, name, mujid, phone, designation, isAdmin }), // Added phone and designation
        headers: { "Content-Type": "application/json" },
      });

      // Check if the response is OK and has content
      if (!res.ok) {
        setMessage(res.message);
      }

      // Try to parse the response as JSON
      const data = await res.json();

      // Check if the response contains a message or error
      if (data.message || data.error) {
        setMessage(data.message || data.error);
      } else {
        setMessage("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error in API call:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white relative rounded-lg shadow-xl p-8 w-full max-w-md mb-4">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Add User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative">
            <FaIdCard className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="MujID"
              value={mujid}
              onChange={(e) => setMujid(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <FaPhone className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <FaBriefcase className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>
          <label htmlFor="isAdmin" className="flex items-center cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                id="isAdmin"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              />
              <FaUserShield className="text-indigo-600 mr-2" />
              <span>Is Admin</span>
            </motion.div>
          </label>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
          >
            {loader ? 
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500 border-opacity-50"></div>
              </div> : 
              'Submit'
            }
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => {
              toggleDeletePop();
            }}
            className="absolute top-[-180px] left-0 w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-300">
            Delete User
          </motion.button>
        </form>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-center text-sm font-medium text-green-600">
            {message}
          </motion.p>
        )}
      </motion.div>

      <div className="absolute top-0 left-0 w-[100vw] h-screen opacity-50 z-[-1]">
        <img
          src="/MUJ-homeCover.jpg"
          alt="image-muj"
          className="w-full h-full object-cover"
        />
      </div>
      {deletePop && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div
            className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-md animate-fade-in-down"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-2xl font-semibold text-gray-900 flex items-center"
                id="modal-headline">
                <FaUserMinus className="mr-2 text-red-500" /> Delete User
              </h3>
              <button
                onClick={() => setDeletePop(false)}
                className="text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={() => { handleDelete(mujid); }} className="space-y-6">
              <div>
                <label
                  htmlFor="mujid"
                  className="block text-sm font-medium text-gray-700">
                  MUJID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="mujid"
                    id="mujid"
                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md transition duration-150 ease-in-out py-4"
                    placeholder="Enter MUJID"
                    value={mujid}
                    onChange={(e) => setMujid(e.target.value)}
                    required
                    aria-describedby="mujid-description"
                  />
                </div>
                <p
                  className="mt-2 text-sm text-gray-500"
                  id="mujid-description">
                  Enter the MUJID of the user you want to delete.
                </p>
                <p className="mt-2 text-sm text-red-500" id="mujid-description">
                  Warning! This action is irreversible!
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                  onClick={() => setDeletePop(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  Delete User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
