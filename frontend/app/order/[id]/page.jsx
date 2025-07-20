"use client";

import { fetchOrderDetails } from "@/lib/features/todos/orderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { orderDetails, loading, error } = useAppSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);
  if (loading) return <p> Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <p className="text-red-600 font-semibold">Error: {error}</p>
        <Link href="/my-orders" className="text-blue-500 hover:underline">
          Back to my orders
        </Link>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <p>No Order Details Found</p>
        <Link href="/my-orders" className="text-blue-500 hover:underline">
          Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      <div className="p-4 sm:p-6 rounded-lg border">
        {/* order info */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Order ID: #{orderDetails._id}
            </h3>
            <p className="text-gray-600">
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <span
              className={`${
                orderDetails.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2`}
            >
              {orderDetails.isPaid ? "Approved" : "Pending"}
            </span>
            <span
              className={`${
                orderDetails.isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2`}
            >
              {orderDetails.isDelivered ? "Delivered" : "Pending"}
            </span>
          </div>
        </div>

        {/* Customer, payment, Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
            <p>Payment Method: {orderDetails.paymentMethod} </p>
            <p>Status: {orderDetails.isPaid ? "Paid" : "UnPaid"} </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
            <p>Shipping Method: {orderDetails.shippingMethod || "N/A"} </p>
            <p>
              Address:{" "}
              {orderDetails.shippingAddress
                ? `${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold mb-4">Products</h4>
          <table className="min-w-full text-gray-600 mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Unit Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItems.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="py-2 px-4 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg mr-4"
                      onError={(e) => (e.target.src = "/placeholder-image.png")}
                    />
                    <Link
                      href={`/collection/all`}
                      className="text-blue-500 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4">${item.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back to my Orders link */}
        <Link href="/my-orders" className="text-blue-500 hover:underline">
          Back to my orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
