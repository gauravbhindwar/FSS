"use client";

import { useState } from "react";

export default function CourseForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [forSemester, setForSemester] = useState("");
  const [courseClassification, setCourseClassification] = useState("THEORY");
  const [courseCode, setCourseCode] = useState("");
  const [courseCredit, setCourseCredit] = useState("");
  const [courseType, setCourseType] = useState("CORE");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/add-course", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        forSemester,
        courseClassification,
        courseCode,
        courseCredit,
        courseType,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Course</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Semester"
        value={forSemester}
        onChange={(e) => setForSemester(e.target.value)}
        required
      />
      <select
        value={courseClassification}
        onChange={(e) => setCourseClassification(e.target.value)}
      >
        <option value="THEORY">Theory</option>
        <option value="LAB">Lab</option>
      </select>
      <input
        type="text"
        placeholder="Course Code"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Course Credit"
        value={courseCredit}
        onChange={(e) => setCourseCredit(e.target.value)}
        required
      />
      <select
        value={courseType}
        onChange={(e) => setCourseType(e.target.value)}
      >
        <option value="CORE">Core</option>
        <option value="ELECTIVE">Elective</option>
      </select>
      <button type="submit">Submit</button>
      <p>{message}</p>
    </form>
  );
}
