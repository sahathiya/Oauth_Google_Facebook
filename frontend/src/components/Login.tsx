

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {  FaFacebook } from "react-icons/fa";
import FacebookLogin, { SuccessResponse } from "@greatsumini/react-facebook-login";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "@/services/api";

function Login() {
  const router = useRouter();
  const [message, setMessage] = useState<{
    text: string;
    severity: "error" | "success";
  }>();

  const onSuccessHandler = async (response: SuccessResponse) => {
    try {
      const apiResponse = await api.post(`auth/facebook-login`, {
        userId: response.userID,
        accessToken: response.accessToken,
      });

      const data = await apiResponse.data;
      console.log("data",data);
      const details={
        name:data.data.name,
        id:data.data.id
      }
      
      if (data.success) {
        localStorage.setItem("user-email", JSON.stringify(details));
        setMessage({ text: "Login successful", severity: "success" });
        router.push("/home");
      }
    } catch (error) {
      console.log("error",error);
      
      setMessage({ text: "Facebook login failed", severity: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (tokenResponse) => {
              try {
                const response = await api.post("/auth/google", {
                  credential: tokenResponse.credential,
                });

                localStorage.setItem("token", response.data.token);
                const data = {
                  name: response.data.user.name,
                  email: response.data.user.email,
                };
                localStorage.setItem("user-email", JSON.stringify(data));
                router.push("/home");
              } catch (err) {
                console.error("Backend verification failed", err);
                setMessage({ text: "Google login failed", severity: "error" });
              }
            }}
            onError={() => {
              console.log("login failed");
              setMessage({ text: "Google login failed", severity: "error" });
            }}
            useOneTap
            auto_select={true}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Facebook Login */}
        <FacebookLogin
          appId="2258405014575800"
          onSuccess={onSuccessHandler}
          onFail={(error) => {
            console.log("Facebook login error", error);
            setMessage({ text: "Facebook login failed", severity: "error" });
          }}
          render={({ onClick }) => (
            <button
              onClick={onClick}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
            >
              <FaFacebook className="text-lg" />
              Sign In with Facebook
            </button>
          )}
        />

        {/* Feedback Message */}
        {message && (
          <p
            className={`text-sm font-medium ${
              message.severity === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
