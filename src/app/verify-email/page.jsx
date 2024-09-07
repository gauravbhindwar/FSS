"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // console.log(token);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setMessage("Password is required");
      return;
    }

    try {
      const res = await fetch("/api/users/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });
      router.push("/");
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error setting password");
    }
  };

  return (
    <div>
      <h1>Set Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Set Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
