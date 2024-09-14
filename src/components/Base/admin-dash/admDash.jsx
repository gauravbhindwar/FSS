"use client";
import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiBook,
  FiFileText,
  FiCalendar,
  FiFeather,
} from "react-icons/fi";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import axios from "axios";
import SVGShuffle from "@/app/verify-email/loader";
import { useRouter } from "next/navigation";

// DashboardCard Component with Framer Motion
const DashboardCard = ({ icon, title, count, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20, zIndex: 1 }}
      animate={{ opacity: 1, scale: 1, y: 0, zIndex: 1 }}
      transition={{
        duration: 0.6,
        type: "spring",
        delay: index * 0.1, // Stagger delay
        bounce: 0.3,
      }}
      whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}
      className={`${color} rounded-lg shadow-md p-4 md:p-6 lg:p-8 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer`}>
      <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
        <div className="p-2 md:p-3 rounded-full bg-white">{icon}</div>
        <h3 className="text-sm md:text-lg lg:text-xl font-semibold">{title}</h3>
      </div>
      {Array.isArray(count) ? (
        <p className="text-lg md:text-2xl lg:text-md font-bold">
          Semesters:{" "}
          {count.flatMap((c, idx) => {
            if (idx === count.length - 1) {
              return c;
            }
            return `${c}, `;
          })}
        </p>
      ) : (
        <p className="text-xl md:text-2xl lg:text-3xl font-bold">
          <CountUp end={count} duration={3} />
        </p>
      )}
      {/* <p className="text-xl md:text-2xl lg:text-3xl font-bold">{count}</p> */}
    </motion.div>
  );
};

// AdminDashboard Component
const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    totalUsers: 0,
    activeCourses: 0,
    formSubmissions: 0,
    forTerm: "",
    semestersInCurrentTerm: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/manageUser");
      console.log(response);
      const {
        totalUsers,
        activeCourses,
        formSubmissions,
        forTerm,
        semestersInCurrentTerm,
      } = response.data;
      console.log(forTerm);
      setData({
        totalUsers,
        activeCourses,
        formSubmissions,
        forTerm,
        semestersInCurrentTerm,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminGreet = `Hello Admin`;

  const router = useRouter();

  return (
    <>
      {loading ? (
        <SVGShuffle />
      ) : (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-blue-500">
          <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8 lg:mb-10">
              {adminGreet}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-4 lg:gap-10">
              {[
                {
                  icon: <FiUsers className="text-blue-500" size={20} />,
                  title: "Total Users",
                  count: data.totalUsers,
                  color: "bg-blue-100",
                },
                {
                  icon: <FiBook className="text-green-500" size={20} />,
                  title: "Active Courses",
                  count: data.activeCourses,
                  color: "bg-green-100",
                },
                {
                  icon: <FiFileText className="text-yellow-600" size={20} />,
                  title: "Form Submissions",
                  count: data.formSubmissions,
                  color: "bg-yellow-100",
                },
              ].map((card, index) => (
                <DashboardCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  count={card.count}
                  color={card.color}
                  index={index}
                />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-4 lg:gap-10">
              {[
                {
                  icon: <FiFeather className="text-teal-900" size={20} />,
                  title: `Admin Form Submission`,
                  color: "bg-teal-400",
                },
              ].map((card, index) => (
                <DashboardCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  color={card.color}
                  onClick={() => router.push("/form")} // was missing () =>
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
