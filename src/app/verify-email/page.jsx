"use client";
import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [validateMessage, setValidateMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token");
      setShowMessage(true);
    }
  }, [token]);

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

  function PassValidate(password) {
    if (!validatePassword(password)) {
      setValidateMessage("Password must be at least 8 characters, contain one uppercase letter, and one special character");
    } else {
      setValidateMessage("");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setMessage("Password is required");
      return;
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    } else if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters, contain one uppercase letter, and one special character");
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
  useEffect(() => {
    const tokenCheck = async () => {
      try {
        if (!token) {
          console.error('Token is missing');
          setMessage('Token is missing');
          router.push('/'); // Redirect to homepage if no token
          return;
        }

        const response = await fetch('/api/users/set-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.message === 'token_used') {
          console.log('Token Used');
          const redirectUrl = new URL("/", window.location.href);
          redirectUrl.searchParams.set("tokenAlert", "true");
          router.push(redirectUrl.href); // Redirect to homepage with tokenAlert
        } else {
          setMessage('Token is valid'); // You can handle success here
          console.dir(data);
        }

      } catch (error) {
        console.error('Error during API call:', error);
        setMessage('Error verifying token');
      }
    };

    tokenCheck();
  }, [token, router]);
  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center relative"
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
          
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-orange-500 active:bg-orange-800">
            Set Password
          </button>
        </form>

        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-md transition-all duration-500 ease-in-out ${
            showMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
