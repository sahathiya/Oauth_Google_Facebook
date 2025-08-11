"use client";

import { googleLogout } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
}
function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user-email");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user-email");
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <div>

       <h1 className="text-2xl text-green-700 text-center p-10 font-bold"> HOME PAGE</h1>
      <h1 className="text-center text-xl"><span className="text-green-700">HELLO</span> {user?.email||user?.name}</h1>
      
 <div className="flex justify-center">
<button
  onClick={handleLogout}
  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
>
  Logout
</button>
 </div>
      
     

    </div>
  );
}

export default HomePage;
