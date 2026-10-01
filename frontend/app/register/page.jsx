"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import register from "@/public/assets/register.webp";
import Image from "next/image";
import { registerUser } from "@/lib/features/todos/authSlice";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { mergeCart } from "@/lib/features/todos/cartSlice";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { user, guestId, loading, error } = useAppSelector(
    (state) => state.auth
  );
  const { cart } = useAppSelector((state) => state.cart);

  const redirect = searchParams.get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (!user) return;

    const destination = isCheckoutRedirect ? "/checkout" : redirect || "/";

    if (cart?.products?.length > 0 && guestId) {
      dispatch(mergeCart({ guestId, userId: user._id || user.id })).finally(
        () => router.push(destination)
      );
    } else {
      router.push(destination);
    }
  }, [user, guestId, cart, router, redirect, isCheckoutRedirect, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !name || !password) return;

    await dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">Hey there! 👋🏼</h1>
          <p className="text-center mb-6">
            Enter your details to create your account.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-sm">Already have an account?</p>
          <div className="text-center">
            <Link
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200 text-sm"
            >
              Login
            </Link>
          </div>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <Image
            src={register}
            alt="Register Your Account"
            className="h-[950px] w-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
