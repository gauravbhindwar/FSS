"use client";
import React, { useState, useEffect } from "react";
// import { useRouter } from 'next/dist/client/router';
import axios from "axios";
import "./Homepage.css";
import { Input } from "@/components/ui/input";
import { Mail, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { set } from "mongoose";

const HomePage = () => {
  const [errorVisible, setErrorVisible] = useState(false);
  const [loginPop, setLoginPop] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const closePopup = () => {
    setLoginPop(false);
    router.replace("/");
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
      // add logic to display error*
      setMessage("Error sending email verification");
    }
  };
  useEffect(() => {
    if (searchParams.get("loginAlert") === "true") {
      setLoginPop(true);
      // router.replace('/');
    }
  }, [searchParams, router]);
  useEffect(() => {
    setErrorVisible(true);
    const timer = setTimeout(() => {
      setErrorVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/users/check-password", { email });

      setIsPasswordEmpty(response.data.isPasswordEmpty);
      console.log(response.data.isPasswordEmpty);
      if (response.data.isPasswordEmpty) {
        await sendEmailVerification();
      }
    } catch (error) {
      // console.log("Error checking password status:", error);
      setMessage("Please Contact Your Admin");
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
    <div className="Body overflow-hidden">
      <div className="form-body ">
        <div className="icon-body">
          <Image
            src="/login-icon-m-site.svg"
            alt="Logo"
            className="login-icon w-screen hidden max-lg:block"
            width={500}
            height={300}
          />
          <Image
            src="/login-icon.svg"
            alt="Logo"
            className="login-icon w-screen block max-lg:hidden"
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
              className="bg-blue-700 max-lg:bg-[#f06543] rounded-xl p-2"
              onClick={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500 border-opacity-50"></div>
                </div>
              ) : (
                "Continue"
              )}
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <button
                className="bg-blue-700 max-lg:bg-[#f06543] rounded-xl p-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500 border-opacity-50"></div>
                  </div>
                ) : (
                  "Login"
                )}
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
      {message && (
        <p
          className={`absolute bg-white text-slate-700 border bottom-4 left-[50%] translate-x-[-50%] text-2xl shadow-lg shadow-red-500 rounded-lg px-4 py-2 transition-opacity duration-1000 ${
            errorVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {message}
        </p>
      )}
      {loginPop && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl text-red-600 font-bold mb-4">PLEASE LOGIN FIRST!</h2>
            <p className="text-gray-700 mb-6">
              Please login first to access any page
            </p>
            <button
              onClick={closePopup}
              className="bg-blue-500 max-lg:bg-[#f06543] text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
