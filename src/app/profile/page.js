"use client";
import axios from "axios";
import React, {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");

    async function logout() {
    try {
      await axios.get('/api/users/logout');
      toast.success('Logout successful');
      router.push('/login');
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  }
  
  useEffect(() => {
    async function getUserDetails() {
      try {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setData(res.data.data);
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
      }
    }
    getUserDetails()
  },[]);
  console.log(data);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{background: "#262626"}}>
      <div className="container mx-auto sm:max-w-md max-w-80 rounded-md p-8 sm:p-12 shadow-2xl shadow-black" style={{background:"#262626"}}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl mb-5 text-center text-white">Profile</h1>
        
        <div className="flex flex-col justify-center items-center">
          <p className="text-white mb-2">Username: {data.username}</p>
          <p className="text-gray-400 text-sm mb-4">Email-id: {data.email}</p>
        </div>
        
        <div className="flex justify-center mt-6"> 
          <button
            onClick={logout}
            className="p-3 justify-center shadow-md shadow-black rounded-lg mb-4 focus:outline-none focus:border-gray-600 hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    
    );
}
