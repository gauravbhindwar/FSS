"use client";
import React, { useState } from "react";
import axios from "axios";
import "./Homepage.css";
import { Input } from "@/components/ui/input";
import { Mail, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const sendEmailVerification = async () => {
    try {
      const response = await axios.post("/api/users/send-verification", {
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.log("Error sending email verification:", error);
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/users/check-password", { email });
      setIsPasswordEmpty(response.data.isPasswordEmpty);

      if (response.data.isPasswordEmpty) {
        await sendEmailVerification();
      }
    } catch (error) {
      console.log("Error checking password status:", error);
      setMessage("Error checking password status");
    }

    setIsLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const loginResponse = await axios.post("/api/users/login", {
        email,
        password,
      });
      if (loginResponse.data.success) {
        router.push("/dashboard"); // Redirect to dashboard or other page upon successful login
      } else {
        setMessage("Invalid email or password");
      }
    } catch (error) {
      console.log("Error logging in:", error);
      setMessage("Error logging in");
    }

    setIsLoading(false);
  };

  return (
    <div className="Body">
      <div className="form-body ">
        <div className="icon-body">
          <Image
            src="/login-icon.svg"
            alt="Logo"
            className="login-icon w-screen"
            width={500}
            height={300}
          />
        </div>
        <div className="form-box">
          <div className="mb-4">
            <div className="relative">
              <Input
                className="pl-10 focus-visible:ring-1"
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {!isPasswordEmpty && (
            <div className="mb-4">
              <div className="relative">
                <Input
                  className="focus-visible:ring-1 !pl-10"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          )}

          {isPasswordEmpty ? (
            <button
              className="bg-blue-700 rounded-xl p-2"
              onClick={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Continue"}
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <button
                className="bg-blue-700 rounded-xl p-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="image-cover">
        <Image
          src="/MUJ-homeCover.jpg"
          alt="image-muj"
          width={500}
          height={300}
        />
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default HomePage;
