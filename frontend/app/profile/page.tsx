"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MyOrdersPage from "../my-orders/page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/lib/features/todos/authSlice";
import { clearCart } from "@/lib/features/todos/cartSlice";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-1/3 lg:w-1/4 h-fit shadow-md rounded-lg p-6 bg-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 break-words">
              {user.name}
            </h1>
            <p className="text-base text-gray-600 mb-5 break-all">
              {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded-lg font-semibold hover:bg-red-600 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </aside>

          <section className="w-full md:w-2/3 lg:w-3/4 min-w-0">
            <MyOrdersPage />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
