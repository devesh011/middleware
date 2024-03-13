"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
  });

  async function onSignup() {
    try {
      setLoading(true);
      event.preventDefault();
      console.log("signing up");
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/login"); // Redirect to the login page after successful signup
    } catch (error) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Reset the error message when user starts typing in the field
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
  
     // Username validation
  if (user.username.trim() === "") {
    newErrors.username = "Username is required";
    valid = false;
  }else if (user.username.length < 3) {
    newErrors.username = "Username must be at least 3 characters long";
    valid = false;
  } else if (!/^[a-zA-Z0-9_]+$/.test(user.username)) {
    newErrors.username = "Username must contain only letters, numbers, or underscores";
    valid = false;
  } else {
    newErrors.username = ""; 
  }

    // Email validation
    if (user.email.trim() === "") {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    } else {
      newErrors.email = ""; 
    }

  // Password validation
    if (user.password.trim() === "") {
      newErrors.password = "Password is required";
      valid = false;
    } else {
      newErrors.password = "";
    }
  
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSignup();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen " style={{ background: "#262626" }}>
      <div className="container mx-auto sm:max-w-md max-w-80 rounded-md p-8 sm:p-12 shadow-2xl shadow-black" style={{ background: "#262626" }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl mb-5 text-center text-white">{loading ? "Processing" : "Signup"}</h1>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-400">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            className="mt-1 pl-2 pb-3 pt-3 rounded-lg shadow-inner shadow-black text-white focus:outline-none focus:border-gray-600 w-full bg-gray-800"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>
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
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
            className="p-3 justify-center shadow-md shadow-black rounded-lg mb-4 focus:outline-none focus:border-gray-600  hover:bg-gray-800"
            disabled={buttonDisabled}
          >
            Sign_up
          </button>
        </div>

        <div className="flex justify-center ">
          <p className="text-white text-sm pr-1">Already have an account?</p>
          <Link href="/login">
            <p className="text-sm hover:text-blue-800 text-blue-600 underline">Log in</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
