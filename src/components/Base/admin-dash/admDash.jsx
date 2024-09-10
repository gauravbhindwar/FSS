'use client';
import React, { useState } from 'react';
import { FiUsers, FiBook, FiFileText, FiMenu, FiUser, FiPrinter, FiLogOut } from 'react-icons/fi';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Helper function to get the initials from the user's name
  const getInitials = (name) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  };

  const userName = "Shivank Goel"; 
  const userRole = "Administrator"; 

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 to-blue-500">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 ease-in-out`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <FiMenu size={24} />
          </button>
          {isSidebarOpen && <h2 className="text-xl font-semibold">Admin Panel</h2>}
        </div>
        <div className="flex flex-col items-center mt-8">
          {/* Replace the image with initials */}
          <div
            className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-2xl font-bold"
          >
            {getInitials(userName)}
          </div>
          {isSidebarOpen && (
            <div className="mt-2 text-center">
              <h3 className="font-semibold">{userName}</h3>
              <p className="text-sm text-gray-500">{userRole}</p>
            </div>
          )}
        </div>
        <nav className="mt-8">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FiUser className="mr-3" />
            {isSidebarOpen && <span>Manage User</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FiBook className="mr-3" />
            {isSidebarOpen && <span>Manage Course</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FiFileText className="mr-3" />
            {isSidebarOpen && <span>Form Status</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FiPrinter className="mr-3" />
            {isSidebarOpen && <span>Print Form</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FiLogOut className="mr-3" />
            {isSidebarOpen && <span>Logout</span>}
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={<FiUsers className="text-blue-500" size={24} />}
            title="Total Users"
            count="1,234"
            color="bg-blue-100"
          />
          <DashboardCard
            icon={<FiBook className="text-green-500" size={24} />}
            title="Active Courses"
            count="42"
            color="bg-green-100"
          />
          <DashboardCard
            icon={<FiFileText className="text-yellow-500" size={24} />}
            title="Form Submissions"
            count="789"
            color="bg-yellow-100"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, count, color }) => {
  return (
    <div
      className={`${color} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-full bg-white">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
};

export default AdminDashboard;
