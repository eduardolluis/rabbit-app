"use client";

import Link from "next/link";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SearchBar from "./SearchBar";
import CartDrawer from "../layout/CartDrawer";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
  
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { cart } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6 ">
        <div>
          {/* LEFT LOGO */}
          <Link href="/" className="text-2xl font-medium ">
            Rabbit
          </Link>
        </div>

        {/* CENTER NAV LINKS */}
        <div className="hidden md:flex space-x-6">
          <Link
            href="/collection/all?gender=Men"
            className="links hover:text-black transition-colors transition-transform duration-300 cursor-pointer  hover:scale-110"
          >
            Men
          </Link>
          <Link
            href="/collection/all?gender=Women"
            className="links hover:text-black transition-colors transition-transform duration-300 cursor-pointer  hover:scale-110"
          >
            Women
          </Link>
          <Link
            href="/collection/all?category=Top Wear"
            className="links hover:text-black transition-colors transition-transform duration-300 cursor-pointer  hover:scale-110"
          >
            Top Wear
          </Link>
          <Link
            href="/collection/all?category=Bottom Wear"
            className="links hover:text-black transition-colors transition-transform duration-300 cursor-pointer  hover:scale-110"
          >
            Bottom Wear
          </Link>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center space-x-4 ">
          {user && user.role === "admin" && (
            <Link
              href="/admin"
              className="block bg-black px-2 rounded text-sm text-white transition-transform duration-300 cursor-pointer  hover:scale-110"
            >
              Admin
            </Link>
          )}

          <Link
            href="/profile"
            className="hover:text-black transition-colors transition-transform duration-300 cursor-pointer  hover:scale-110"
          >
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black transition-colors"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 transition-transform duration-300 cursor-pointer  hover:scale-110" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1  primary text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* SEARCH ICON */}
          <div className="overflow-hidden ">
            <SearchBar />
          </div>

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4 flex-row">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              href="/collection/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              href="/collection/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Women
            </Link>
            <Link
              href="/collection/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Top Wear
            </Link>
            <Link
              href="/collection/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
