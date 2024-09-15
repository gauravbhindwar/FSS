"use client";
import React from "react";
import {
  FaUser,
  FaCog,
  FaChartBar,
  FaSignOutAlt,
  FaArrowRight,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

type SelectedUserProp = any;

const UserDashboard = (props) => {
  const [user, setUser] = React.useState<any>({});
  const [isFormFilled, setIsFormFilled] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<SelectedUserProp>(null);
  const mujidCookie = props?.cookies[0];
  const mujid = mujidCookie[1]?.value;
  // console.log(mujid);

  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/users/profile");
      if (response.ok) {
        const user = await response.json();
        return user;
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  const getInitials = (name: String) => {
    if (!name) return "";
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  React.useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await fetchUser();
        user.initials = getInitials(user.name);
        return user;
      } catch (error) {
        console.error("Error initializing user:", error);
        return {
          name: "Unknown",
          designation: "Unknown",
          initials: "U",
        };
      }
    };
    const formFilled = async () => {
      try {
        const response = await axios.post("/api/admin/manageUser/getAdmin");
        // console.log(response.data);
        setIsFormFilled(response.data.isFormFilled);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching current admin:", error.message);
        } else {
          console.error("Error fetching current admin:", error);
        }
      }
    }
    const formData = async () => {
      try {
        const response = await axios.get("/api/form", {
          params: { mujid },
        });
        setSelectedUser(response.data.forms);
      } catch (error) {
        console.error("Error fetching form details:", error);
      }
    }

    formFilled();
    formData();

    initializeUser().then((user) => {
      setUser(user);
    });
  }, []);

  const websiteFeatures = [
    {
      title: "Data Analytics",
      description: "Powerful tools for analyzing and visualizing your data",
      icon: <FaChartBar className="text-3xl mb-4 text-orange-500" />,
    },
    {
      title: "User Profile",
      description:
        "Efficient system for managing user accounts and permissions",
      icon: <FaUser className="text-3xl mb-4 text-orange-500" />,
    },
    {
      title: "Advanced Settings",
      description:
        "Customize your experience with our advanced configuration options",
      icon: <FaCog className="text-3xl mb-4 text-orange-500" />,
    },
  ];

  const handleLogout = () => {
    fetch("/api/users/logout", {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          router.push("/");
          router.refresh();
        } else {
          console.error("Failed to log out");
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-400 to-green-200  p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {user.initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.designation}</p>
            </div>
          </div>
          <motion.div
            className="bg-orange-200 p-4 rounded-lg cursor-pointer hover:bg-orange-300 flex items-center justify-between"
            onClick={() => {
              router.push("/form");
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}>
            {isFormFilled ? (
              <>
                <div className="flex items-center w-[fit-content]">
                  <FaArrowRight className="hidden md:block text-2xl text-orange-500 mr-4" />
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Subject Selection Form
                    </h2>
                    <p className="text-gray-700">
                      Please click here to fill and submit the form for Subject
                      Selection
                    </p>
                  </div>
                </div>
                <FaArrowRight className="text-2xl text-orange-500 md:hidden w-[20px]" />
              </>
            ) : (
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-4">Selected Courses</h2>
                <div className="space-y-4">
                  {selectedUser?.allSelectedCourses?.map((course, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold mb-2">Course {index + 1}</h3>
                      <p className="text-gray-800 mb-1">
                        <strong>Theory Course:</strong> {course.theoryCourses}
                      </p>
                      <p className="text-gray-800">
                        <strong>Lab Course:</strong> {course.labCourses}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {websiteFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white pointer-events-none cursor-pointer rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="bg-red-500 p-4 rounded-lg cursor-pointer hover:bg-red-600 transition duration-300 text-white"
          onClick={() => setShowLogoutModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          <div className="flex items-center justify-center">
            <FaSignOutAlt className="text-2xl mr-2" />
            <h2 className="text-lg font-semibold">Logout</h2>
          </div>
          <p className="text-center mt-2">Click here to log out</p>
        </motion.div>
        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <FaQuestionCircle className="text-4xl text-orange-500 mb-4 mx-auto" />
              <h2 className="text-2xl font-semibold mb-4">
                Are you sure you want to log out?
              </h2>
              <div className="flex justify-center gap-4">
                <motion.button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                >
                  Yes, Log Out
                </motion.button>
                <motion.button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutModal(false)} // Close modal
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;
function async() {
  throw new Error("Function not implemented.");
}
