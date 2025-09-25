"use client";

import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [userData, setUserData] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Logging untuk verifikasi token

        const response = await fetch("http://localhost:8000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        console.log("Response Data:", result); // Logging respons API

        if (response.ok && result.success) {
          const userData = result.user; // Mengambil data user dari respons
          setUserData(userData); // Update state dengan data user
          setFormData(userData); // Update state form untuk editing
        } else {
          console.error("API Error:", result);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("token");

    // Arahkan ke halaman home
    router.push("/");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for editing profile
 const handleEditSubmit = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Tambahkan log ini

    const response = await fetch(`http://localhost:8000/api/users/${userData.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pastikan token benar
      },
      body: JSON.stringify(formData),
    });

    console.log("Response status:", response.status);
    const responseBody = await response.json();
    console.log("Response body:", responseBody);

    if (response.ok) {
      setUserData(responseBody);
      setIsEditing(false);
    } else {
      console.error("Failed to update profile:", responseBody.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

  return (
    <div className="p-20 mt-5 flex flex-col items-center gap-8">
      <div className="w-full">
        <h1 className="text-5xl font-semibold">Profile</h1>
        <div className="bg-black p-10 flex flex-col gap-5 mt-2 rounded-[25px] text-xl">
          {isEditing ? (
            <>
              <input
                name="name"
                value={formData.username}
                onChange={handleInputChange}
                className="p-2 rounded"
                placeholder="Name"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-2 rounded"
                placeholder="Email"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="p-2 rounded"
                placeholder="Phone"
              />
              <button
                onClick={handleEditSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Save
              </button>
            </>
          ) : (
            <>
              <p>Name: {userData.username}</p>
              <p>Email: {userData.email}</p>
              <p>Phone: {userData.phone}</p>
              {/* <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
                Edit
              </button> */}
            </>
          )}
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-5xl font-semibold">Address</h1>
        <div className="bg-black p-10 flex flex-row justify-between gap-5 mt-2 rounded-[25px] text-xl">
          {isEditing ? (
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-2 rounded"
              placeholder="Address"
            />
          ) : (
            <p>{userData.address}</p>
          )}
          {isEditing && (
            <button
              onClick={handleEditSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Save
            </button>
          )}
        </div>
      </div>
      <button
        className="text-2xl p-5 px-10 rounded-xl bg-white text-black font-semibold transition duration:200ms ease-in-out hover:scale-105 hover:translate-y-[-5px]"
        onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
