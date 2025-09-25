"use client";

import * as Font from "@/components/fonts";
import { notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage({ params }) {
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slug, setSlug] = useState(null);
  const [auth, setAuth] = useState("unregistered");
  const [selectedSize, setSelectedSize] = useState("XL");

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (!isExpired) {
          setAuth("authorized");
        } else {
          setAuth("unregistered");
          localStorage.removeItem("token");
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
    (async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    })();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${slug}`
        );
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
          setMainImageIndex(0);
          setSelectedSize(data.product.sizes[0]?.size || "XL");
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  // Fungsi Add to Cart
  async function handleAddToCart() {
    if (btnLoading) return;
    setBtnLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must login first");

      const body = {
        product_id: product.product_id,
        quantity: 1,
        size: selectedSize,
      };

      const res = await fetch("http://localhost:8000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

    } catch (err) {
      alert(err.message);
    } finally {
      setBtnLoading(false);
    }
  }

  // Fungsi Buy Now -> buat order dan redirect ke /checkout
  async function handleBuyNow() {
    if (btnLoading) return;
    setBtnLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must login first");

      const body = {
        items: [
          {
            product_id: product.product_id,
            size: selectedSize,
            quantity: 1,
          },
        ],
      };

      console.log(product.product_id, selectedSize);

      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to create order");

      // Redirect ke halaman checkout
      router.push("/orders");
    } catch (err) {
      alert(err.message);
    } finally {
      setBtnLoading(false);
    }
  }

  if (loading)
    return (
      <p className="h-screen w-full flex flex-col items-center justify-center text-4xl font-semibold">
        Loading...
      </p>
    );
  if (error) return notFound();

  if (!product) {
    notFound();
  }

  return (
    <div className="text-white flex flex-col p-20 mt-28 w-full ">
      <div className="flex flex-row gap-10 justify-between">
        <div
          className="relative h-[650px] w-[550px] bg-no-repeat bg-center border-white border-[2px] rounded-xl overflow-visible"
          style={{
            backgroundImage: `url(${product.images[mainImageIndex]?.image_url}.jpg)`,
            backgroundSize: "cover",
          }}
        >
          <div
            className="absolute z-10 flex items-center justify-center left-[-40px] top-[180px] w-[120px] h-[120px] bg-black rounded-[10px] cursor-pointer"
            style={{
              backgroundImage: `url(${product.images[0]?.image_url}.jpg)`,
              backgroundSize: "cover",
              border:
                mainImageIndex === 0
                  ? "3px solid white"
                  : "3px solid transparent",
            }}
            onClick={() => setMainImageIndex(0)}
          ></div>

          <div
            className="absolute z-10 flex items-center justify-center left-[-40px] bottom-[180px] w-[120px] h-[120px] bg-black rounded-[10px] cursor-pointer"
            style={{
              backgroundImage: `url(${product.images[1]?.image_url}.jpg)`,
              backgroundSize: "cover",
              border:
                mainImageIndex === 1
                  ? "3px solid white"
                  : "3px solid transparent",
            }}
            onClick={() => setMainImageIndex(1)}
          ></div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className={`text-6xl font-bold ${Font.dmSerifDisplay.className}`}>
              {product.name}
            </h1>
            <p className="text-2xl mt-4">Harga: Rp. {product.price}</p>
            <h1 className="my-10 text-2xl flex flex-row">
              Size : <p className="font-bold">{selectedSize}</p>
            </h1>
            <div className="flex flex-row gap-10">
              {product.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(item.size)}
                  className={`font-bold text-3xl rounded-xl w-[80px] h-[80px] ${
                    selectedSize === item.size
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col text-3xl gap-3 mt-10">
            <button
              onClick={handleAddToCart}
              disabled={btnLoading}
              className="bg-black p-5 rounded-xl font-semibold"
            >
              {btnLoading ? "Processing..." : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={btnLoading}
              className="bg-black p-5 rounded-xl font-semibold"
            >
              {btnLoading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
      <h1 className="mt-20 text-4xl font-semibold">Description</h1>
      <p className="mt-4 text-lg w-[50%]">{product.description}</p>
      {auth === "unregistered" && (
        <div className="h-screen w-full p-20 flex flex-col gap-20 justify-evenly">
          <div className="bg-gradient-to-b from-gray-50 to-orange-200 h-[calc(100%/1.1)] px-10 rounded-[40px] flex flex-row justify-between items-center">
            <div className="w-[50%] flex flex-col gap-5 text-black">
              <h1 className="text-6xl font-bold">Join Our Member and Get More Benefits</h1>
              <p className="text-xl ">
                Discover a collection of stylish and thoughtful gifts perfect for
                any occasion. Whether you're looking for trendy outfits, we have
                something special for everyone.
              </p>
              <Link
                href={"/login"}
                className="text-2xl w-[40%] text-center font-semibold p-4 px-8 bg-transparent border-black border-4 rounded-[70px] hover:bg-black hover:text-orange-200 transition duration-300 ease-in-out"
              >
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
      )}
    </div>
  );
}
