"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearCart } from "@/lib/features/todos/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { checkout } = useAppSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && (checkout._id || checkout.id)) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      router.push("/my-orders");
    }
  }, [checkout, dispatch, router]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thanks For Your Purchase!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order date:{" "}
                {checkout.createdAt &&
                  new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{" "}
                {checkout.createdAt &&
                  calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Ítems del pedido */}
          {checkout.checkoutItems && checkout.checkoutItems.length > 0 && (
            <div className="mb-20">
              {checkout.checkoutItems.map((item) => (
                <div
                  key={item.productId || item._id}
                  className="flex items-center mb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h4 className="text-md font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.color} | {item.size}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-md">${item.price}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Información de pago y entrega */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">Paypal</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              {checkout.shippingAddress && (
                <>
                  <p className="text-gray-600">
                    {checkout.shippingAddress.address}
                  </p>
                  <p className="text-gray-600">
                    {checkout.shippingAddress.city},{" "}
                    {checkout.shippingAddress.country}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
