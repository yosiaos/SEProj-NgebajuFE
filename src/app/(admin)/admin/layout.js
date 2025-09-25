"use client";

import "@/app/globals.css";
import * as Font from "@/components/fonts.js";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin-sidebar";

// export const metadata = {
//   title: "NgeBaju - Atmin",
//   description: "Group 8th - Software Engineering Project",
// };

export default function AuthLayout({ children }) {
  const [auth, setAuth] = useState(null); // null untuk menunjukkan status belum diperiksa
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode token
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode payload JWT

        const isExpired = payload.exp * 1000 < Date.now(); // Cek apakah token kedaluwarsa

        if (!isExpired) {
          if (payload.role === "admin") {
            setAuth("authorized"); // Role admin
          } else {
            router.push("/"); // Redirect ke halaman 404 jika bukan admin
          }
        } else {
          setAuth("unregistered"); // Token kedaluwarsa
          localStorage.removeItem("token"); // Bersihkan token
          router.push("/"); // Redirect ke halaman 404 jika token kedaluwarsa
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setAuth("unregistered");
        router.push("/"); // Redirect ke halaman 404 jika token tidak valid
      }
    } else {
      setAuth("unregistered");
      router.push("/"); // Redirect ke halaman 404 jika tidak ada token
    }
  }, [router]);

  if (auth === null) {
    // Tampilkan layar loading sementara otentikasi diperiksa
    return (
      <div className="h-screen bg-background text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${Font.poppins.className} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen bg-gray-900 flex">
          <AdminSidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col lg:ml-0">
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
