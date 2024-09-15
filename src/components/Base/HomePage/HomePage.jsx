"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Homepage.css";
import { Input } from "@/components/ui/input";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const EmailInput = ({ email, handleEmailChange }) => (
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
);

const PasswordInput = ({
  password,
  handlePasswordChange,
  showPassword,
  toggleShowPassword,
}) => (
  <div className="mb-4">
    <div className="relative">
      <Input
        className="focus-visible:ring-1 !pl-10"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
      <div
        className="absolute bottom-1 w-[fit-content] right-2 bg-transparent text-gray-500 pl-6 cursor-pointer"
        onClick={toggleShowPassword}>
        {showPassword ? <EyeOff /> : <Eye />}
      </div>
    </div>
  </div>
);

const LoadingButton = ({ isLoading, onClick, children }) => (
  <button
    className="bg-blue-700 max-lg:bg-[#f06543] rounded-xl p-2"
    onClick={onClick}
    disabled={isLoading}>
    {isLoading ? (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    ) : (
      children
    )}
  </button>
);

const Popup = ({ title, message, onClose }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl text-red-600 font-bold mb-4">{title}</h2>
      <p className="text-gray-700 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="bg-blue-500 max-lg:bg-[#f06543] text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Close
      </button>
    </div>
  </div>
);

const HomePage = (props) => {
  const cookies = props.cookies;
  const [errorVisible, setErrorVisible] = useState(false);
  const [loginPop, setLoginPop] = useState(false);
  const [tokenPop, setTokenPop] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const closePopup = () => {
    setLoginPop(false);
    setTokenPop(false);
    router.replace("/");
  };

  const sendEmailVerification = useCallback(async () => {
    try {
      const response = await axios.post("/api/users/send-verification", {
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      // console.log("Error sending email verification:", error);
      setMessage("Error sending email verification");
    }
  }, [email]);

  useEffect(() => {
    if (searchParams.get("loginAlert") === "true") {
      setLoginPop(true);
    } else if (searchParams.get("tokenAlert") === "true") {
      setTokenPop(true);
    }
  }, [searchParams, router]);

  useEffect(() => {
    setErrorVisible(true);
    const timer = setTimeout(() => {
      setErrorVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleContinue = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/users/check-password", { email });
      setIsPasswordEmpty(response.data.isPasswordEmpty);
      if (response.data.isPasswordEmpty) {
        await sendEmailVerification();
      }
    } catch (error) {
      setMessage("Please Contact Your Admin");
    }

    setIsLoading(false);
  }, [email, sendEmailVerification]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const adminVerifyResponse = await axios.post("/api/users/check-admin", {
        email,
      });
      if (adminVerifyResponse.data.success) {
        router.push("/admin");
      } else {
        const loginResponse = await axios.post("/api/users/login", {
          email,
          password,
        });
        if (loginResponse.data.success) {
          router.push("/dashboard");
        } else {
          setMessage("Invalid email or password");
        }
      }
    } catch (error) {
      setMessage("Error logging in");
    }

    setIsLoading(false);
  }, [email, password, router]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        if (isPasswordEmpty) {
          handleContinue();
        } else {
          handleSubmit(event); // Trigger login if the password field is visible and filled
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [email, password, isPasswordEmpty, handleContinue, handleSubmit]);

  return (
    <div className="Body overflow-hidden">
      <div className="form-body">
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
          <EmailInput email={email} handleEmailChange={handleEmailChange} />
          {!isPasswordEmpty && (
            <PasswordInput
              password={password}
              handlePasswordChange={handlePasswordChange}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
            />
          )}
          {isPasswordEmpty ? (
            <LoadingButton isLoading={isLoading} onClick={handleContinue}>
              Continue
            </LoadingButton>
          ) : (
            <form onSubmit={handleSubmit}>
              <LoadingButton isLoading={isLoading} type="submit">
                Login
              </LoadingButton>
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
          }`}>
          {message}
        </p>
      )}
      {loginPop && (
        <Popup
          title="PLEASE LOGIN FIRST!"
          message="Please login first to access any page"
          onClose={closePopup}
        />
      )}
      {tokenPop && (
        <Popup
          title="INVALID TOKEN"
          message="A token works only one time"
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default HomePage;
