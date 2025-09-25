"use client";

import * as Font from "@/components/fonts.js";

import Link from "next/link";

import { useState, useEffect } from "react";

import { ShoppingBag } from "lucide-react";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/categories/${category}/products`
        ); // Ganti dengan URL API kamu
        const data = await response.json();

        // console.log(data);

        // console.log(data.products);
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
    console.log(products)
  }, [category]);

  return (
    <div className="text-white flex flex-col items-center mt-28 w-full">
      <h1
        className={`${Font.dmSerifDisplay.className} text-6xl border-b-2 border-solid border-white pt-0 p-5`}>
        Collections
      </h1>
      <div className="flex flex-row gap-20 m-5 text-4xl ">
        <button onClick={() => setCategory(1)}>
          <h1 className={category == 1 ? "font-semibold" : "font-[400]"}>
            Men
          </h1>
        </button>
        <button onClick={() => setCategory(2)}>
          <h1 className={category == 2 ? "font-semibold" : "font-[400]"}>
            Women
          </h1>
        </button>
      </div>
      {loading === true ? (
        <div className="flex flex-row flex-wrap gap-12 w-[calc(100%/1.2)] justify-center">
          <div className="w-[30%]">
            <div className="relative w-[300px] h-[300px] rounded-[15px] bg-thirtiery overflow-visible bg-contain bg-no-repeat bg-center animate-pulse"></div>
            <h1 className="bg-thirtiery mt-4 h-[40px] w-full rounded-lg"></h1>
            <p className="bg-thirtiery h-[30px] w-[50%] mt-4 rounded-lg"></p>
          </div>
          <div className="w-[30%]">
            <div className="relative w-[300px] h-[300px] rounded-[15px] bg-thirtiery overflow-visible bg-contain bg-no-repeat bg-center animate-pulse"></div>
            <h1 className="bg-thirtiery mt-4 h-[40px] w-full rounded-lg"></h1>
            <p className="bg-thirtiery h-[30px] w-[50%] mt-4 rounded-lg"></p>
          </div>
          <div className="w-[30%]">
            <div className="relative w-[300px] h-[300px] rounded-[15px] bg-thirtiery overflow-visible bg-contain bg-no-repeat bg-center animate-pulse"></div>
            <h1 className="bg-thirtiery mt-4 h-[40px] w-full rounded-lg"></h1>
            <p className="bg-thirtiery h-[30px] w-[50%] mt-4 rounded-lg"></p>
          </div>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-12 w-[calc(100%/1.2)] justify-center">
          {products.map((item, index) => {
            return (
              <div key={index} className="w-[30%]">
                <div
                  className="relative w-[300px] h-[300px] rounded-[15px] overflow-visible bg-contain bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url(${item.images[1]?.image_url}.jpg)`,
                  }}>
                  <Link
                    href={`/products/details/${item.product_id}`}
                    className="absolute z-10 flex items-center justify-center right-[-20px] bottom-[-20px] bg-white w-[80px] h-[80px] rounded-[50px] animate-none transition-transform duration-200 hover:-translate-y-2 ">
                    <ShoppingBag stroke="black" size={38} />
                  </Link>
                </div>
                <h1 className="font-semibold text-3xl mt-4">{item.name}</h1>
                <p className="">Rp. {item.price}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
