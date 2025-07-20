"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import register from "@/public/assets/register.webp";
import Image from "next/image";
import { registerUser } from "@/lib/features/todos/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { mergeCart } from "@/lib/features/todos/cartSlice";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, guestId } = useAppSelector((state) => state.auth);
  const { cart } = useAppSelector((state) => state.cart);
  const dispatch = useDispatch();

  const redirect = searchParams.get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          router.push(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        router.push(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, router, isCheckoutRedirect, dispatch]);
  // Redux hooks
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));

    // Basic validation
    if (!email || !name || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Debugging logs
    console.log("Attempting registration with:", {
      name,
      email,
      password: "***",
    });
    console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

    try {
      // Dispatch the registerUser thunk
      const result = await dispatch(
        registerUser({
          name,
          email,
          password,
        })
      );

      console.log("Registration result:", result);

      // Check if registration was successful
      if (registerUser.fulfilled.match(result)) {
        console.log("Registration successful!");
        // You might want to redirect to login or dashboard here
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
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
          <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋🏼</h2>
          <p className="text-center mb-6">
            Enter your details to create your account.
          </p>

          {/* Error message display */}
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

          {/* Texto centrado con link */}
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
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
