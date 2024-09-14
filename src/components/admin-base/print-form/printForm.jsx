"use client";
import React, { useEffect, useState } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx";

const FormDownloadPage = (props) => {
  const [formCount, setFormCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const cookies = props.cookies;

  const handleDownload = async () => {
    setShowPopup(true);

    try {
      const response = await axios.get("/api/admin/printForms");

      // Log the entire response for debugging
      // console.log("API Response:", response.data);

      const { formArray } = response.data;

      if (!formArray) {
        throw new Error("Form data not found in the response");
      }

      // Format the data for Excel
      const formattedData = formArray.map(({ Name, mujid, email, courses, semesters, Phone, Designation }) => {
        const rowData = {
          Name: Name,
          MUJID: mujid,
          Email: email,
          Phone: Phone,
          Designation: Designation
        };

        courses.forEach((course, index) => {
          rowData[`Semester ${semesters[index]} Lab`] = course[0];
          rowData[`Semester ${semesters[index]} Theory`] = course[1];
        });

        return rowData;
      });

      // Create a new workbook and add the data
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Auto-size columns
      const maxWidth = 50; // Maximum column width
      const columnsWidth = formattedData.reduce((acc, row) => {
        Object.keys(row).forEach((key, index) => {
          const cellValue = row[key] ? row[key].toString() : "";
          acc[index] = Math.min(Math.max(acc[index] || 0, cellValue.length), maxWidth);
        });
        return acc;
      }, []);

      worksheet["!cols"] = columnsWidth.map((width) => ({ width }));

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Form Data");

      // Generate the Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      // Create download link and trigger download
      const fileName = "form_data.xlsx";
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(data, fileName);
      } else {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(data);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }

      // console.log("Download completed");
    } catch (error) {
      console.error("Error downloading data:", error);
      alert("There was an error while downloading the data. Please try again.");
    } finally {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    const getFormSubmissions = async () => {
      try {
        const response = await axios.get("/api/admin/manageUser");
        // console.log("Form submissions response:", response.data);
        const { formSubmissions } = response.data;
        setFormCount(formSubmissions || 0); // Set formCount or default to 0 if undefined
      } catch (error) {
        console.error("Error fetching form submissions:", error);
      }
    };

    getFormSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Forms Download Page</h1>

          <div className="mb-6">
            <label htmlFor="formCount" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Forms Filled: {formCount}
            </label>
          </div>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <FaDownload className="mr-2" />
            Download Forms in XL
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[11]">
          <div className="bg-white p-5 rounded-lg shadow-xl relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <FaTimes />
            </button>
            <p className="text-lg font-semibold">Your download is in progress...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDownloadPage;
