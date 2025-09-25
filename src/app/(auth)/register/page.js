"use client";

import * as Font from "@/components/fonts.js";
import "@/style/form.css";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => {
    // regex sederhana untuk validasi email
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const validatePhone = (phone) => {
    // cek hanya angka dan minimal 9 digit
    return /^[0-9]{9,}$/.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi semua field wajib diisi
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    // Validasi email
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validasi password panjang minimal 6 karakter
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Cek password dan konfirmasi harus sama
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validasi phone number
    if (!validatePhone(formData.phone)) {
      setError("Phone number must be numeric and at least 9 digits.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Account created successfully! You can now log in.");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="w-[50%] h-auto">
      <h1 className={`${Font.dmSerifDisplay.className} text-7xl`}>NgeBaju</h1>
      <div className="top-button-wrapper">
        <Link href={"/login"} className="top-button">
          Login
        </Link>
        <Link
          href={"/register"}
          className="top-button pointer-events-none active">
          Register
        </Link>
      </div>
      <form className="text-white gap-2" onSubmit={handleRegister}>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="email@gmail.com"
        />

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="********"
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="********"
        />

        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="08123456789"
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Jl.NamaJalan No. KodePos"
        />

        <div className="bottom-button-wrapper flex flex-col mt-5">
          <button
            type="submit"
            className="bot-button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create Account
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
