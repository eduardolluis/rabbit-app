"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBoxOpen, FaClipboardList, FaStore, FaUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { logout } from "@/lib/features/todos/authSlice";
import { clearCart } from "@/lib/features/todos/cartSlice";
import { useAppDispatch } from "@/lib/hooks";

const NavLink = ({ to, children, className = "" }) => {
  const pathname = usePathname();

  const isActive = () => {
    if (to === "/admin") {
      return pathname === "/admin";
    }
    // Evita que "/" se active en rutas de admin
    if (to === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(to);
  };

  return (
    <Link
      href={to}
      className={`${className} ${
        isActive()
          ? "bg-gray-700 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      } px-4 rounded flex items-center gap-2 py-3 transition-colors duration-200 transition-transform duration-300 cursor-pointer  hover:scale-105`}
    >
      {children}
    </Link>
  );
};

const AdminSidebar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push("/");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin" className="text-2xl font-medium">
          Rabbit
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink to="/admin/users">
          <FaUser />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/products">
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/orders">
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/">
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-transform duration-300 cursor-pointer  hover:scale-105"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
