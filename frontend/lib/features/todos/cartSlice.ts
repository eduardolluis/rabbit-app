import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import demoProducts from "@/lib/demoProducts";

interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface Cart {
  products: CartItem[];
  totalPrice: number;
}

interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
}

interface FetchCartParams {
  userId?: string;
  guestId?: string;
}

interface AddToCartParams {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  guestId?: string;
  userId?: string;
}

interface UpdateCartItemQuantityParams {
  productId: string;
  quantity: number;
  guestId?: string;
  userId?: string;
  size: string;
  color: string;
}

interface RemoveFromCartParams {
  productId: string;
  guestId?: string;
  userId?: string;
  size: string;
  color: string;
}

interface MergeCartParams {
  guestId: string;
  userId: string;
}

const emptyCart = (): Cart => ({ products: [], totalPrice: 0 });

const calculateTotal = (products: CartItem[]) =>
  Number(
    products
      .reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0)
      .toFixed(2)
  );

const normalizeCart = (cart: Partial<Cart> | null | undefined): Cart => {
  const products = Array.isArray(cart?.products) ? cart.products : [];
  return {
    products,
    totalPrice:
      typeof cart?.totalPrice === "number"
        ? cart.totalPrice
        : calculateTotal(products),
  };
};

const loadCartFromStorage = (): Cart => {
  if (typeof window === "undefined") return emptyCart();

  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? normalizeCart(JSON.parse(storedCart)) : emptyCart();
  } catch {
    return emptyCart();
  }
};

const saveCartToStorage = (cart: Cart): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(normalizeCart(cart)));
  }
};

const productById = (productId: string) =>
  demoProducts.find(
    (product: any, index: number) =>
      String(product._id || product.sku || `product-${index + 1}`) ===
      String(productId)
  );

const addLocally = ({
  productId,
  quantity,
  size,
  color,
}: AddToCartParams): Cart => {
  const cart = loadCartFromStorage();
  const existing = cart.products.find(
    (item) =>
      String(item.productId) === String(productId) &&
      item.size === size &&
      item.color === color
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    const product: any = productById(productId);
    if (!product) return cart;

    cart.products.push({
      productId,
      name: product.name,
      image: product.images?.[0]?.url || "/product-placeholder.svg",
      price: Number(product.price || 0),
      quantity,
      size,
      color,
    });
  }

  cart.totalPrice = calculateTotal(cart.products);
  saveCartToStorage(cart);
  return cart;
};

const updateLocally = ({
  productId,
  quantity,
  size,
  color,
}: UpdateCartItemQuantityParams): Cart => {
  const cart = loadCartFromStorage();
  const item = cart.products.find(
    (product) =>
      String(product.productId) === String(productId) &&
      product.size === size &&
      product.color === color
  );

  if (item) item.quantity = Math.max(1, quantity);
  cart.totalPrice = calculateTotal(cart.products);
  saveCartToStorage(cart);
  return cart;
};

const removeLocally = ({
  productId,
  size,
  color,
}: RemoveFromCartParams): Cart => {
  const cart = loadCartFromStorage();
  cart.products = cart.products.filter(
    (product) =>
      !(
        String(product.productId) === String(productId) &&
        product.size === size &&
        product.color === color
      )
  );
  cart.totalPrice = calculateTotal(cart.products);
  saveCartToStorage(cart);
  return cart;
};

export const fetchCart = createAsyncThunk<Cart, FetchCartParams>(
  "cart/fetchCart",
  async ({ userId, guestId }) => {
    try {
      const response = await axios.get<Cart>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`,
        { params: { userId, guestId } }
      );
      const cart = normalizeCart(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch {
      return loadCartFromStorage();
    }
  }
);

export const addToCart = createAsyncThunk<Cart, AddToCartParams>(
  "cart/addToCart",
  async (params) => {
    try {
      const response = await axios.post<Cart>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`,
        params
      );
      const cart = normalizeCart(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch {
      return addLocally(params);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk<
  Cart,
  UpdateCartItemQuantityParams
>("cart/updateCartItemQuantity", async (params) => {
  try {
    const response = await axios.put<Cart>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`,
      params
    );
    const cart = normalizeCart(response.data);
    saveCartToStorage(cart);
    return cart;
  } catch {
    return updateLocally(params);
  }
});

export const removeFromCart = createAsyncThunk<Cart, RemoveFromCartParams>(
  "cart/removeFromCart",
  async (params) => {
    try {
      const response = await axios<Cart>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`,
        data: params,
      });
      const cart = normalizeCart(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch {
      return removeLocally(params);
    }
  }
);

export const mergeCart = createAsyncThunk<Cart, MergeCartParams>(
  "cart/mergeCart",
  async ({ guestId, userId }) => {
    try {
      const response = await axios.post<Cart>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/merge`,
        { guestId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      const cart = normalizeCart(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch {
      return loadCartFromStorage();
    }
  }
);

const initialState: CartState = {
  cart: loadCartFromStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = emptyCart();
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    },
  },
  extraReducers: (builder) => {
    const pending = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };
    const fulfilled = (state: CartState, action: any) => {
      state.loading = false;
      state.cart = normalizeCart(action.payload);
      state.error = null;
      saveCartToStorage(state.cart);
    };
    const rejected = (state: CartState) => {
      state.loading = false;
      state.error = "Unable to update cart";
    };

    builder
      .addCase(fetchCart.pending, pending)
      .addCase(fetchCart.fulfilled, fulfilled)
      .addCase(fetchCart.rejected, rejected)
      .addCase(addToCart.pending, pending)
      .addCase(addToCart.fulfilled, fulfilled)
      .addCase(addToCart.rejected, rejected)
      .addCase(updateCartItemQuantity.pending, pending)
      .addCase(updateCartItemQuantity.fulfilled, fulfilled)
      .addCase(updateCartItemQuantity.rejected, rejected)
      .addCase(removeFromCart.pending, pending)
      .addCase(removeFromCart.fulfilled, fulfilled)
      .addCase(removeFromCart.rejected, rejected)
      .addCase(mergeCart.pending, pending)
      .addCase(mergeCart.fulfilled, fulfilled)
      .addCase(mergeCart.rejected, rejected);
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
