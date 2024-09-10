"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const FormsTable = () => {
  const [users, setUsers] = useState([]);
  const [searchMUJid, setSearchMUJid] = useState("");
  const [debouncedSearchMUJid, setDebouncedSearchMUJid] = useState("");
  const [selectedUserForms, setSelectedUserForms] = useState(null);
  const [isGlideOutOpen, setIsGlideOutOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchMUJid(searchMUJid);
    }, 300); // Debounce delay of 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchMUJid]);

  useEffect(() => {
    fetchUsers(debouncedSearchMUJid);
  }, [debouncedSearchMUJid]);

  const fetchUsers = async (MUJid) => {
    try {
      const response = await axios.get(`/api/admin/manageUser`, {
        params: { MUJid },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchMUJid(e.target.value);
  };

  const handleRowClick = async (mujid) => {
    try {
      const response = await axios.get(`/api/form`, {
        params: { mujid },
      });
      setSelectedUserForms(response.data.forms);
      setIsGlideOutOpen(true);
    } catch (error) {
      console.error("Error fetching form details:", error);
    }
  };

  const usersWithFormFilled = users.filter((user) => user.isFormFilled);
  const usersWithoutFormFilled = users.filter((user) => !user.isFormFilled);

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by MUJid"
          value={searchMUJid}
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 rounded-l-md"
        />
      </div>
      <h2 className="text-xl font-bold mb-4">Users with Form Filled</h2>
      <table className="min-w-full bg-white mb-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">MUJid</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Form Filled</th>
          </tr>
        </thead>
        <tbody>
          {usersWithFormFilled.map((user) => (
            <tr
              key={user._id}
              className="cursor-pointer"
              onClick={() => handleRowClick(user.mujid)}
            >
              <td className="py-2 px-4 border-b">{user.mujid}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">true</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mb-4">Users without Form Filled</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">MUJid</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Form Filled</th>
          </tr>
        </thead>
        <tbody>
          {usersWithoutFormFilled.map((user) => (
            <tr key={user._id} className="cursor-pointer">
              <td className="py-2 px-4 border-b">{user.mujid}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">false</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isGlideOutOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end">
          <div className="bg-white w-1/3 h-full p-4">
            <button onClick={() => setIsGlideOutOpen(false)} className="mb-4">
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">Form Details</h2>
            {selectedUserForms ? (
              <div>
                {selectedUserForms.map((form, index) => (
                  <div key={index} className="mb-4">
                    <p>
                      <strong>MUJid:</strong> {form.mujid}
                    </p>
                    <p>
                      <strong>Name:</strong> {form.Name}
                    </p>
                    <p>
                      <strong>Email:</strong> {form.email}
                    </p>
                    <p>
                      <strong>All Selected Courses:</strong>{" "}
                      {Array.isArray(form.allSelectedCourses)
                        ? form.allSelectedCourses.join(", ")
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Is Even:</strong> {form.isEven ? "Yes" : "No"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No form details available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsTable;
