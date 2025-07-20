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

  return (
    <div className=" min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* left section */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text'3xl font'bold mb-4">
              {user?.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* right section */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
