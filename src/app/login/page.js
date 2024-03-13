"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Reset the error message when user starts typing in the field
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user.email.trim() === "") {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(user.email.trim())) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!user.password || !user.password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const onLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/profile");
    } catch (error) {
      console.log("Login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin();
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen py-2" style={{background: "#262626"}}>
      <div className="container mx-auto sm:max-w-md max-w-80 rounded-md p-8 sm:p-12 shadow-2xl shadow-black" style={{background:"#262626"}}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl mb-5 text-center text-white">{loading ? "Processing" : "Login"}</h1>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="mt-1 pl-2 pb-3 pt-3 rounded-lg shadow-inner shadow-black text-white focus:outline-none focus:border-gray-600 w-full bg-gray-800"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-400">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={user.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="mt-1 pl-2 pb-3 pt-3 rounded-lg shadow-inner shadow-black text-white focus:outline-none focus:border-gray-600 w-full bg-gray-800"
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          {user.password.trim() !== '' && (
            <div className="absolute right-4 top-[65%] transform -translate-y-1/2 cursor-pointer">
              {showPassword ? (
                <VscEyeClosed onClick={() => setShowPassword(false)} />
              ) : (
                <VscEye onClick={() => setShowPassword(true)} />
              )}
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="p-3 justify-center shadow-md shadow-black rounded-lg mb-4 focus:outline-none focus:border-gray-600 hover:bg-gray-800"
            disabled={buttonDisabled}
          >
            Log in
          </button>
        </div>
        
        <div className="flex justify-center ">
          <p className="text-white text-sm pr-1">Don&apos;t have an account?</p>
          <Link href="/signup">
            <p className="text-sm hover:text-blue-800 text-blue-600 underline">Sign Up</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
