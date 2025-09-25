"use client";

import * as Font from "@/components/fonts.js";

import Link from "next/link.js";
import Image from "next/image.js";
import { useState, useEffect } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(1);
  const [auth, setAuth] = useState("unregistered");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode token (opsional)
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode payload JWT

        const isExpired = payload.exp * 1000 < Date.now(); // Cek apakah token kedaluwarsa

        if (!isExpired) {
          setAuth("authorized"); // Token valid
        } else {
          setAuth("unregistered"); // Token kedaluwarsa
          localStorage.removeItem("token"); // Bersihkan token
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setAuth("unregistered");
      }
    } else {
      setAuth("unregistered");
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`http://localhost:8000/api/products`); // Ganti dengan URL API kamu
        const data = await response.json();

        console.log(data.products[0].images[0].image_url);
        if (data.success) {
          setProducts(data.products);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  return (
    <div className="flex flex-col max-w-screen">
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/homepage/home-background.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-30 shadow-[inset_0px_-200px_100px_30px_rgba(0,_0,_0,_0.6)] flex flex-col justify-end gap-8 p-20 h-screen w-full text-white">
          <h1
            className={`${Font.dmSerifDisplay.className} text-8xl animate-revealBot`}>
            NgeBaju{" "}
          </h1>
          <h1
            className="font-bold text-7xl animate-revealBot"
            style={{ animationDelay: "0ms" }}>
            Newest Collection
          </h1>
          <div className="flex flex-row justify-between w-full items-center">
            <p
              className="w-[40%] text-lg animate-revealBot"
              style={{ animationDelay: "300ms" }}>
              Simple looks, real comfort. At NgeBaju, we design everyday wear
              that feels good and fits your style clean, casual, and made
              to move with you.
            </p>
            <Link
              href={"/products"}
              className="text-2xl font-semibold p-6 px-10 bg-transparent border-white border-4 rounded-[70px] hover:bg-white hover:text-black transition duration-300 ease-in-out animate-revealBot"
              style={{ animationDelay: "300ms" }}>
              Discover Now
            </Link>
          </div>
        </div>
      </div>
      <div className="h-screen w-full flex flex-col items-center my-10">
        <h1 className={`${Font.dmSerifDisplay.className} text-8xl mb-10`}>
          Our New Releases
        </h1>
        {loading === true ? (
          <div className="grid grid-cols-3 grid-rows-2 gap-8 h-full w-[calc(100%/1.4)]">
            <div
              className="col-span-2 row-span-1 bg-thirtiery flex items-center justify-center animate-pulse duration-700 rounded-[30px]"
              style={{ animationDelay: "0ms" }}></div>
            <div
              className="col-span-1 row-span-1 bg-thirtiery flex items-center justify-center animate-pulse duration-700 rounded-[30px]"
              style={{ animationDelay: "200ms" }}></div>
            <div
              className="col-span-1 row-span-1 bg-thirtiery flex items-center justify-center animate-pulse duration-700 rounded-[30px]"
              style={{ animationDelay: "200ms" }}></div>
            <div
              className="col-span-2 row-span-1 bg-thirtiery flex items-center justify-center animate-pulse duration-700 rounded-[30px]"
              style={{ animationDelay: "600ms" }}></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 grid-rows-2 gap-8 h-full w-[calc(100%/1.4)]">
            {products.slice(0, 4).map((items, index) => {
              return (
                <Link
                  href={`/products/details/${items.product_id}`}
                  key={index}
                  className={`col-span-${
                    index % 4 === 0 || index % 4 === 3 ? "2" : "1"
                  } row-span-1 flex items-center justify-center duration-700 bg-white/75 rounded-[30px]`}
                  style={{
                    backgroundImage: `url(${items.images[1]?.image_url}.jpg)`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <div className="bg-black bg-opacity-50 w-full h-full flex items-end text-white rounded-[30px] text-start">
                    <h2 className="text-3xl font-bold m-8">{items.name}</h2>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div
        id="about"
        className="bg-black p-20 flex flex-col items-center justify-center h-screen">
        <h1 className={`${Font.dmSerifDisplay.className} text-7xl text-white`}>
          Our Store History
        </h1>
        <p className="text-xl w-[calc(100%/1.7)] mt-8 text-center">
          <span className={`${Font.dmSerifDisplay.className} mr-2 text-4xl`}>
            NgeBaju
          </span>
          started as a Software Engineering project in a BINUS classroom in
          February 2025. From a simple academic assignment, it has grown into a
          clothing store that offers unique apparel with a touch of luxury. We
          carefully curate our selections to reflect creativity, quality, and
          originality—making sure every piece stands out while staying refined.
        </p>
      </div>
      
      <div className={` h-screen w-full p-20 flex flex-col gap-20 justify-evenly ${auth == "authorized" ? "hidden" : "flex"}`}>
        <h1
          className={`${Font.dmSerifDisplay.className} mx-auto text-7xl text-white`}>
          Enough for the Wait, Start Shopping Now!
        </h1>
        <div className="bg-gradient-to-b from-gray-50 to-orange-200 h-[calc(100%/1.1)] px-10 rounded-[40px] flex flex-row justify-between items-center">
          <div className="w-[50%] flex flex-col gap-5 text-black">
            <h1 className="text-6xl font-bold">
              Join Our Member and Get More Benefits
            </h1>
            <p className="text-xl ">
              Discover a collection of stylish and thoughtful gifts perfect for
              any occasion. Whether you're looking for trendy outfits, we have
              something special for everyone.
            </p>
            <Link
              href={"/login"}
              className="text-2xl w-[40%] text-center font-semibold p-4 px-8 bg-transparent border-black border-4 rounded-[70px] hover:bg-black hover:text-orange-200 transition duration-300 ease-in-out">
              Sign Up for Member
            </Link>
          </div>
          <div className="relative w-[calc(100%/2)] h-full self-end">
            <Image
              src={"/homepage/model-girl.png"}
              layout="fill"
              objectFit="cover"
              style={{ objectPosition: "0% 40%" }}
              alt="cewe model berdiri itam"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
