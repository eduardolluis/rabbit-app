"use client";

import Link from "next/link";
import React from "react";
import { FiPhoneCall } from "react-icons/fi";
import { RiTwitterXFill } from "react-icons/ri";
import { TbBrandMeta, TbBrandInstagram } from "react-icons/tb";

const Footer = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription submitted");
  };

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        {/* Newsletter Section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events and online
            offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>
          {/* NEWSLETTER FORM */}
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your Email"
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              required
            />
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all cursor-pointer hover:scale-105 "
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* SHOP LINKS */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT LINKS */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <TbBrandMeta className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <TbBrandInstagram className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors "
            >
              <RiTwitterXFill className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p>
            <FiPhoneCall className="inline-block mr-2" />
            849-407-0063
          </p>
        </div>
      </div>
      {/* FOOTER Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          © 2025, CompileTab. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
