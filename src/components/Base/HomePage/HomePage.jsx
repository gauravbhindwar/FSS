"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Homepage.css";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Mail, LockKeyhole } from "lucide-react";
const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [message, setMessage] = useState("");
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onContinue = async (event) => {
    event.preventDefault();
    togglePassword;
    setIsLoading(true);
    try {
      if (isPasswordEmpty) {
        await sendEmailVerification();
      } else {
        await togglePassword();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  async function togglePassword() {
    try {
      const response = await axios.post("/api/users/", {
        email,
        action: "check",
      });
      if (response.data.password === false) {
        setIsPasswordEmpty(true);
      } else {
        setIsPasswordEmpty(false);
        router.push("/invalidUser");
      }
    } catch (error) {
      console.log(error);
    }
  }
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
      console.log(error);
    }
  };

  return (
    <div className="Body">
      <div className="form-body ">
        <div className="icon-body">
          {/* <img src={`./login-icon.svg`} alt="Logo" className="login-icon" /> */}
        </div>
        <div className="form-box">
          {/* handle form submit */}
          <form>
            <div className="mb-4">
              <div className="relative">
                <Input
                  className="pl-10 focus-visible:ring-1 "
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  disabled={!isPasswordEmpty}
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

            <button
              className="bg-blue-700 rounded-xl p-2"
              type="submit"
              disabled={isLoading}
              onClick={onContinue}
            >
              {isLoading
                ? "Loading..."
                : isPasswordEmpty
                ? "Continue" // if password is empty then show continue else set password
                : "Set Password"}
            </button>
          </form>
        </div>
      </div>
      <div className="image-cover">
        {/* <img src="./MUJ-homeCover.jpg" alt="image-muj" /> */}
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default HomePage;
