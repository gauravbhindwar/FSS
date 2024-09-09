"use client";
import { useState } from "react";

export default function AdminForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mujid, setMujid] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/manageUser", {
      method: "POST",
      body: JSON.stringify({ email, name, mujid, isAdmin }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Admin</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="MujID"
        value={mujid}
        onChange={(e) => setMujid(e.target.value)}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />{" "}
        Is Admin
      </label>
      <button type="submit">Submit</button>
      <p>{message}</p>
    </form>
  );
}
