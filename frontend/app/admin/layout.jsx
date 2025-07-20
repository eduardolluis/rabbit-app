// app/admin/AdminLayout.tsx
"use client";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/features/todos/authSlice";
import { clearCart } from "@/lib/features/todos/cartSlice";

export default function AdminLayout({
  children,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col md:flex-row relative">
        {/* Mobile toggle button */}
        <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
          <button onClick={toggleSidebar}>
            <FaBars size={24} />
          </button>
          <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
        >
          <AdminSidebar />
        </div>

        {/* Main content */}
        <div className="flex-grow p-6 overflow-auto">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
