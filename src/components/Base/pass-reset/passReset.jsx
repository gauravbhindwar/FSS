"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SVGShuffle from "@/app/verify-email/loader";

export default function VerifyEmail(props) {
  const [loading, setLoading] = useState(true);
  const [tokenUsed, setTokenUsed] = useState(true);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [validateMessage, setValidateMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  // console.log(token);

  useEffect(() => {
    const tokenCheck = async () => {
      if (!token) {
        setMessage("Token is missing");
        setShowMessage(true);
        router.push("/"); // Redirect to homepage if no token
        return;
      }

      try {
        const response = await fetch("/api/users/set-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (data.status === 407) {
          const redirectUrl = new URL("/", window.location.href);
          redirectUrl.searchParams.set("tokenAlert", "true");
          router.push(redirectUrl.href); // Redirect to homepage with tokenAlert
        } else if (data.message === "token_used") {
          setTokenUsed(true);
          const redirectUrl = new URL("/", window.location.href);
          redirectUrl.searchParams.set("tokenAlert", "true");
          router.push(redirectUrl.href); // Redirect to homepage with tokenAlert
        } else if (data.message === "token_not_used") {
          setTokenUsed(false);
          setMessage("Token is valid"); // Handle valid token scenario
        }
      } catch (error) {
        console.error("Error during API call:", error);
        setMessage("Error verifying token");
        const redirectUrl = new URL("/", window.location.href);
        redirectUrl.searchParams.set("tokenAlert", "true");
        router.push(redirectUrl.href); // Redirect to homepage with tokenAlert
      } finally {
        setLoading(false);
      }
    };

    tokenCheck();
  }, [token, router]);

  useEffect(() => {
    if (message) {
      setShowMessage(true);

      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);

      return () => clearTimeout(timer); // Clean up the timeout
    }
  }, [message]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  };

  const PassValidate = (password) => {
    if (!validatePassword(password)) {
      setValidateMessage(
        "Password must be at least 8 characters, contain one uppercase letter, and one special character"
      );
    } else {
      setValidateMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setMessage("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (!validatePassword(password)) {
      setMessage(
        "Password must be at least 8 characters, contain one uppercase letter, and one special character"
      );
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

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        router.push("/");
      } else {
        setMessage(data.message || "Error setting password");
      }
    } catch (error) {
      setMessage("Error setting password");
    }
  };

  if (loading) {
    return <SVGShuffle />; // Display loading state while token is being checked
  }

  if (!tokenUsed) {
    return (
      <div
        className="flex items-center justify-center h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/MUJ-homeCover.jpg')" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg w-80">
          <h1 className="text-2xl font-bold mb-4 text-center">Set Password</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                PassValidate(e.target.value);
              }}
              className="p-2 border border-gray-300 rounded focus:outline-none"
            />

            <p className="text-xs text-red-500">{validateMessage}</p>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-orange-500 active:bg-orange-800">
              Set Password
            </button>
          </form>

          <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-md transition-all duration-500 ease-in-out ${
              showMessage
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}>
            {message}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
