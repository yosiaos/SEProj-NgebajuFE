"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { StepBack, SkipForward } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();

  const [auth, setAuth] = useState("unregistered");
  const [orders, setOrders] = useState(null); // state untuk simpan data orders
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

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
    if (auth === "authorized") {
      // fetch orders user dari API
      const fetchOrders = async () => {
        setLoading(true);
        try {
          // Ganti URL sesuai API kamu
          const res = await fetch(`http://localhost:8000/api/orders/me?page=${page}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await res.json();

          if (data.success) {
            setOrders(data.orders);
            setPagination(data.pagination.pages)
          } else {
            setOrders([]);
          }
        } catch (error) {
          console.error("Fetch orders error:", error);
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [auth, page]);

  const handleRedirect = (id) => {
    localStorage.setItem("currentOrderId", id); // Simpan ID order ke localStorage
    router.push("/checkout");
  };

  const nextPage =() =>{
    if(page < pagination && page != pagination){
      console.log("adalah", page)
      setPage((page) => page + 1);
      console.log("cihuy",page)
    }
  }
  
  const prevPage = () => {
    if(page != 1) {
      console.log("adalah", page)
      setPage((page) => page - 1);
      console.log("cihuy",page)
    }
  }

  if (loading) {
    return (
      <div className="h-screen p-20 flex items-center justify-center text-3xl font-semibold">
        Loading orders...
      </div>
    );
  }

  if (auth === "unregistered") {
    return (
      <div className="h-screen p-20 flex flex-col items-center justify-center">
        <div className="bg-black w-[70%] h-[35%] rounded-[25px] flex justify-center items-center">
          <Link href="/register" className="font-semibold text-4xl underline">
            Register Your Account.
          </Link>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="h-screen p-20 flex flex-col items-center justify-center gap-10">
        <div className="bg-black w-[70%] h-[35%] rounded-[25px] flex flex-col justify-center items-center">
          <h1 className="font-semibold text-4xl text-white">No orders yet.</h1>
          <p className="text-xl text-white/50">
            Go to{" "}
            <Link href="/products" className="underline">
              Store
            </Link>{" "}
            to place an order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-20 flex flex-col items-center gap-10">
      {orders.map((order) => (
        <button
          onClick={() => handleRedirect(order.order_id)}
          key={order.order_id}
          className="bg-black w-[70%] gap-10 rounded-[25px] flex flex-col justify-between items-center p-10">
          <div className="flex flex-row justify-between w-full font-semibold text-4xl">
            <h1>Order #{order.order_id}</h1>
            <h1>Order Status: {order.status}</h1>
          </div>
          <div className="flex flex-col w-full gap-6">
            {order?.items?.map((item) => (
              <div
                key={`${item.product_id}-${item.size}`}
                className="flex flex-row justify-between w-full text-2xl">
                <p>
                  {item.products.name} x {item.quantity} (
                  {item.size || "No Size"})
                </p>
                <p>Rp.{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between w-full text-2xl font-semibold mt-4">
            <p>Total: Rp.{order.total_price}</p>
            <p></p>
          </div>
        </button>
      ))}
      <div className="w-full flex flex-row justify-between text-4xl font-bold">
        <h1>Page : {page}</h1>
        <div>
          <button onClick={prevPage}>
            &lt;
            Previous
          </button>
          <button onClick={nextPage} className="ml-10">
            Next
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
