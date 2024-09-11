"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaIdCard, FaUserShield } from "react-icons/fa";
import Image from "next/image";
import { set } from "mongoose";

export default function AdminForm() {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mujid, setMujid] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
  
    try {
      const res = await fetch("/api/admin/manageUser", {
        method: "POST",
        body: JSON.stringify({ email, name, mujid, isAdmin }),
        headers: { "Content-Type": "application/json" },
      });
  
      // Check if the response is OK and has content
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4"
    style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
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
            className="relative"
          >
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
            className="relative"
          >
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
            { loader ? 
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500 border-opacity-50"></div>
            </div> : 
            'Submit'}
          </motion.button>
        </form>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-center text-sm font-medium text-green-600"
          >
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
    </div>
  );
}
