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
    <div className="w-full">
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="grid grid-cols-[84px_minmax(0,1fr)] gap-4 py-5 border-b border-gray-200"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-[84px] h-28 object-cover rounded-md bg-gray-100"
            onError={(e) => {
              e.currentTarget.src = "/product-placeholder.svg";
            }}
          />

          <div className="min-w-0 flex flex-col gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 leading-snug break-words">
                {product.name}
              </h3>

              <div className="mt-1 text-sm text-gray-500 leading-5">
                <p>
                  <span className="font-medium text-gray-600">Size:</span>{" "}
                  {product.size}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Color:</span>{" "}
                  {product.color}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 shrink-0">
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
                  className="border border-gray-300 rounded-md w-8 h-8 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  -
                </button>

                <span className="min-w-7 text-center font-medium text-gray-900">
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
                  className="border border-gray-300 rounded-md w-8 h-8 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <p className="font-semibold text-gray-900 whitespace-nowrap">
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
                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label={`Remove ${product.name} from cart`}
                >
                  <RiDeleteBin3Line className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
