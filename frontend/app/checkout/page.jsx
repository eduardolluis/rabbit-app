"use client";

import PaypalButton from "@/components/cart/PaypalButton";
import { createCheckout } from "@/lib/features/todos/checkoutSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  // Ensure cart is loaded before proceeding
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      router.push("/");
    }
  }, [cart, router]);

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

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      try {
        // Verificar que tenemos la URL del backend
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";
        console.log("Backend URL:", backendUrl);

        const res = await dispatch(
          createCheckout({
            checkoutItems: cart.products,
            shippingAddress,
            paymentMethod: "Paypal",
            totalPrice: cart.totalPrice,
          })
        );

        if (res.payload) {
          console.log("Checkout created successfully:", res.payload);
          const id = res.payload._id || res.payload.id;
          if (id) {
            setCheckoutId(id);
          } else {
            console.error("No checkout ID received");
            alert("Error: No checkout ID received from server");
          }
        } else {
          console.error("No payload received:", res);
          alert("Error creating checkout. Please try again.");
        }
      } catch (error) {
        console.error("Error creating checkout:", error);
        alert(
          "Error creating checkout. Please check your connection and try again."
        );
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    if (isProcessingPayment) return; // Prevent double processing

    setIsProcessingPayment(true);

    try {
      // Verificar que tenemos checkoutId y backend URL
      if (!checkoutId) {
        throw new Error("No checkout ID available");
      }

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";
      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Updating payment status for checkout:", checkoutId);
      console.log(
        "Making request to:",
        `${backendUrl}/api/checkout/${checkoutId}/pay`
      );

      // Step 1: Update payment status
      const response = await axios.put(
        `${backendUrl}/api/checkout/${checkoutId}/pay`,
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

      if (response.status === 200) {
        console.log("Payment status updated successfully");
        // Step 2: Finalize the checkout
        await handleFinalizeCheckout(checkoutId);
      } else {
        throw new Error(
          `Payment update failed with status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data
        );
        alert(
          `Payment processing failed: ${
            error.response.data?.message || "Server error"
          }`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Payment processing failed: Unable to connect to server");
      } else {
        console.error("Error setting up request:", error.message);
        alert(`Payment processing failed: ${error.message}`);
      }
      setIsProcessingPayment(false);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";
      const token = localStorage.getItem("userToken");

      console.log("Finalizing checkout:", checkoutId);

      const response = await axios.post(
        `${backendUrl}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // CAMBIO AQUÍ: Aceptar tanto 200 como 201
      if (response.status === 200 || response.status === 201) {
        console.log("Checkout finalized successfully:", response.data);

        // Clear cart or perform any cleanup
        // dispatch(clearCart()); // Uncomment if you have this action

        // Redirect to confirmation page
        router.push("/order-confirmation");
      } else {
        throw new Error(`Finalization failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error finalizing checkout:", error);

      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data
        );
        alert(
          `Order finalization failed: ${
            error.response.data?.message || "Server error"
          }`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Order finalization failed: Unable to connect to server");
      } else {
        alert(`Order finalization failed: ${error.message}`);
      }

      setIsProcessingPayment(false);
    }
  };

  if (loading) return <p>Loading Cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* LEFT SECTION */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
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
              type="text"
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
                className="w-full bg-black text-white py-3 rounded"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                {isProcessingPayment ? (
                  <div className="w-full bg-gray-300 text-gray-600 py-3 rounded text-center">
                    Processing Payment...
                  </div>
                ) : (
                  <PaypalButton
                    amount={cart.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                      alert("Payment Failed, please try again later");
                      setIsProcessingPayment(false);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* RIGHT SECTION */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>

        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl">${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>

        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>

        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
