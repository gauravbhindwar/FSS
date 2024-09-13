import React from "react";
import axios from "axios";

const ManageSemester = () => {
  const handlePostRequest = async () => {
    try {
      const response = await axios.post("/api/admin/getSemesters", {
        isEven: true,
      });
      // console.log("Response:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div>
      <h1>Manage Semester</h1>
      {/* <button onClick={handlePostRequest}>Send POST Request</button> */}
    </div>
  );
};

export default ManageSemester;
