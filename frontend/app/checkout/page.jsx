"use client";

import PaypalButton from "@/components/cart/PaypalButton";
import { createCheckout } from "@/lib/features/todos/checkoutSlice";
import { saveDemoOrder } from "@/lib/demoStore";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const { checkout } = useAppSelector((state) => state.checkout);
  const { user } = useAppSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart?.products?.length) {
      router.push("/");
    }
  }, [cart, router]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (!cart?.products?.length) return;

    const result = await dispatch(
      createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "PayPal",
        totalPrice: cart.totalPrice,
      })
    );

    const payload = result.payload;
    const id = payload?._id || payload?.id;

    if (id) {
      setCheckoutId(id);
    }
  };

  const finalizeLocally = (paymentDetails) => {
    if (!checkout) return;

    saveDemoOrder({
      checkout,
      user,
      paymentDetails,
    });

    router.push("/order-confirmation");
  };

  const handlePaymentSuccess = async (details) => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);

    if (!checkoutId || checkout?.demo) {
      finalizeLocally(details);
      return;
    }

    const token = localStorage.getItem("userToken");

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      router.push("/order-confirmation");
    } catch {
      finalizeLocally(details);
    }
  };

  if (!cart?.products?.length) {
    return <p className="p-8 text-center">Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>

        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              className="w-full p-2 border rounded bg-gray-50"
              disabled
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded font-semibold cursor-pointer hover:bg-gray-800 transition-colors"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Payment</h3>
                {isProcessingPayment ? (
                  <div className="w-full bg-gray-200 text-gray-600 py-3 rounded text-center">
                    Processing Payment...
                  </div>
                ) : (
                  <PaypalButton
                    amount={cart.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onError={() => {
                      setIsProcessingPayment(false);
                      alert("Payment failed. Please try again.");
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>

        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-4 py-3 border-b"
            >
              <div className="flex items-start min-w-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4 rounded"
                  onError={(e) => {
                    e.currentTarget.src = "/product-placeholder.svg";
                  }}
                />
                <div className="min-w-0">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-gray-500 text-sm">Size: {product.size}</p>
                  <p className="text-gray-500 text-sm">Color: {product.color}</p>
                  <p className="text-gray-500 text-sm">
                    Quantity: {product.quantity}
                  </p>
                </div>
              </div>

              <p className="font-medium whitespace-nowrap">
                ${(product.price * product.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${Number(cart.totalPrice || 0).toFixed(2)}</p>
        </div>

        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>

        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4 font-semibold">
          <p>Total</p>
          <p>${Number(cart.totalPrice || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
