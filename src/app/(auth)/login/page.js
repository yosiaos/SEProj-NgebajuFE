"use client";

import * as Font from "@/components/fonts.js";
import "@/style/form.css";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Ganti next/router
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format: Expected JSON");
      }

      const data = await response.json();
      console.log(data); // Debug respons dari API

      if (data.success) {
        localStorage.setItem("token", data.token);
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-[50%]">
      <h1 className={`${Font.dmSerifDisplay.className} text-7xl`}>NgeBaju</h1>
      <div className="top-button-wrapper">
        <Link href={"/"} className="top-button pointer-events-none active">
          Login
        </Link>
        <Link href={"/register"} className="top-button">
          Register
        </Link>
      </div>
      <form className="text-white">
        <label>Email</label>
        <input
          value={email}
          placeholder="email@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password" // Tambahkan tipe password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="pasword"
        />
        {/* <div className="flex flex-row justify-between">
          <div>
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <Link className="forgot-password" href={"../forgot-password"}>
            Forgot Password?
          </Link>
        </div> */}

        <div className="bottom-button-wrapper flex flex-col gap-0 mt-8">
          <button type="button" onClick={handleLogin} className="bot-button">
            Login
          </button>
          <div className="flex flex-row items-center">
            <div className="w-full bg-white h-[2px]"></div>
            <p className="p-5">or</p>
            <div className="w-full bg-white h-[2px]"></div>
          </div>
          <Link href={"/"} className="bot-button">
            Browse Store
          </Link>
        </div>
      </form>
    </div>
  );
}
