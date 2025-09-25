'use client';

import { useState, useEffect } from "react";

export default function CartPopUp({ isVisible, onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isVisible) return;

    async function fetchCart() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must login first");

        const res = await fetch("http://localhost:8000/api/cart", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCart(data.cart);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex justify-end items-center z-50 overflow-y-hidden">
      <div className="bg-white p-12 shadow-lg w-[35%] h-screen rounded-tl-[30px] rounded-bl-[30px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✖
        </button>
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cart ? (
          <div className="flex flex-col gap-6">
            {cart.items.map((item) => (
              <div
                key={item.item_id}
                className="flex flex-row border-b-2 border-solid border-gray-200 pb-6 text-black"
              >
                <div
                  className="w-[150px] h-[150px] bg-cover bg-center rounded-xl"
                  style={{backgroundImage: `url(${item.product.image}.jpg)`}}
                ></div>
                <div className="flex flex-row justify-between w-full px-4">
                  <div>
                    <h1 className="font-semibold text-lg">{item.product.name}</h1>
                    <p className="text-gray-500">
                      Size: {item.size} | Quantity: {item.quantity}
                    </p>
                    <p>Total: Rp. {item.subtotal.toLocaleString()}</p>
                  </div>
                  <div>
                    <h1 className="font-semibold">Actions</h1>
                    {/* Placeholder for update/remove item actions */}
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-6 text-black">
              <h2 className="text-lg font-bold">
                Total Items: {cart.item_count}
              </h2>
              <h2 className="text-lg font-bold">
                Total Price: Rp. {cart.total.toLocaleString()}
              </h2>
            </div>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
