"use client";
import { IoMdClose } from "react-icons/io";
import CartContent from "../cart/CartContent";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const router = useRouter();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      router.push("/login?redirect=checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <>
      {/* Overlay to mobile  */}
      {drawerOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 sm:block hidden"
          onClick={toggleCartDrawer}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        } w-full sm:w-80 md:w-96 lg:w-1/4 xl:w-1/4`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4 border-b border-gray-100">
          <button
            onClick={toggleCartDrawer}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Cart contents with scrollable area */}
        <div className="flex-grow p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cart && cart?.products.length > 0 ? (
            <CartContent cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <p>You cart is empty</p>
          )}
        </div>

        {/* Checkout button - sticky at bottom */}
        <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
          {cart && cart?.products.length > 0 && (
            <>
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                Checkout
              </button>
              <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
                Shipping, taxes, and discount codes calculated at checkout.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
