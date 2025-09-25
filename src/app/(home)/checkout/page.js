'use client'

import { CircleCheck, Truck, Upload } from "lucide-react";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const [order, setOrder] = useState(null); // State untuk menyimpan data order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});

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
          setUserData(userData); 
        } else {
          console.error("API Error:", result);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }


  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const orderId = localStorage.getItem("currentOrderId"); // Ambil ID order dari localStorage
        const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch order");

        const data = await response.json();
        setOrder(data.order); // Ambil pesanan pertama (dari contoh API)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  if (loading) {
    return (
      <div className="h-screen p-20 flex items-center justify-center text-3xl font-semibold">
        Loading orders...
      </div>
    );
  }
  if (error){
    return (
      <div className="h-screen p-20 flex items-center justify-center text-3xl font-semibold">
        Error
      </div>
    );  
  };

  return (
    <div className="p-20 pr-0 flex flex-row justify-between ">
      {/* Sidebar */}
      <div className="flex flex-col gap-10 w-[25%] ">
        <h1>Account</h1>
        <div>
          <h1 className="text-2xl font-semibold">Delivery</h1>
          <div className="flex flex-row justify-between bg-black p-5 rounded-xl mt-2">
            <div className="flex flex-row gap-2">
              <CircleCheck />
              <p>Ship only</p>
            </div>
            <Truck />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Address</h1>
          <div className="bg-black rounded-xl mt-2 text-center py-10 text-xl">
            {userData.address}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Payment (Transfer only)</h1>
          <div className="flex flex-row bg-black p-5 rounded-xl mt-2">
            <CircleCheck />
            <div>
              <h2>BCA (Bank Central Asia)</h2>
              Account BCA : 449-001-3747 - Rafid
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl">Order Status :</p>
          <h1
            className={`p-3 px-10 text-xl font-semibold rounded-[50px] ${getStatusColor(order.status)}`}
          >
            {order.status}
          </h1>
        </div>
      </div>

      {/* Order Details */}
      <div className="fixed flex-flex-col overflow-auto top-28 right-0 h-[calc(100%/1.2)] bg-white w-[40%] text-black p-10 rounded-[50px] rounded-tr-none rounded-br-none shadow-xl">
        {order.items.map((item) => (
          <div key={item.order_item_id} className="flex flex-row mb-5">
            <div style={{backgroundImage: `url(${item.product_image}.jpg)`}} className="w-[200px] h-[200px] rounded-[15px] overflow-visible bg-contain bg-no-repeat bg-center">
            </div>
            <div className="flex flex-row justify-between w-full pl-5">
              <div>
                <h1>{item.products.name}</h1>
                <p>Size: {item.size}</p>
                <p>Qty: {item.quantity}</p>
              </div>
              <p>Rp. {item.price * item.quantity}</p>
            </div>
          </div>
        ))}
        <div className="flex flex-row w-full justify-between mt-10">
          <p>Subtotal</p>
          <p>Rp. {order.total_price}</p>
        </div>
        <div className="h-[2px] bg-black my-5"></div> 
      </div>
    </div>
  );
}
