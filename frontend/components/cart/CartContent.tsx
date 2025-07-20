import {
  removeFromCart,
  updateCartItemQuantity,
} from "@/lib/features/todos/cartSlice";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useAppDispatch } from "@/lib/hooks";
import { FC } from "react";
import { CartContentProps } from "@/lib/types";

const CartContent: FC<CartContentProps> = ({ cart, userId, guestId }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (
    productId: string,
    delta: number,
    quantity: number,
    size: string,
    color: string
  ) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (
    productId: string,
    size: string,
    color: string
  ) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-4 border-b border-gray-200 gap-4"
        >
          {/* Imagen del producto */}
          <div className="flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover rounded"
            />
          </div>

          {/* Información del producto */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500">
              Size: {product.size} | Color: {product.color}
            </p>
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                handleAddToCart(
                  product.productId,
                  -1,
                  product.quantity,
                  product.size,
                  product.color
                )
              }
              className="border border-gray-300 rounded w-8 h-8 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition-transform duration-300 cursor-pointer  hover:scale-110"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">
              {product.quantity}
            </span>
            <button
              onClick={() =>
                handleAddToCart(
                  product.productId,
                  1,
                  product.quantity,
                  product.size,
                  product.color
                )
              }
              className="border border-gray-300 rounded w-8 h-8 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition-transform duration-300 cursor-pointer  hover:scale-110"
            >
              +
            </button>
          </div>

          {/* Precio y botón eliminar */}
          <div className="flex flex-col items-end space-y-2">
            <p className="font-semibold text-gray-900">
              ${product.price.toLocaleString()}
            </p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
              className="text-gray-400 hover:text-red-500 transition-colors transition-transform duration-300 cursor-pointer  hover:scale-110"
            >
              <RiDeleteBin3Line className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
