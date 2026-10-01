import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getDemoOrderById, getDemoOrdersForUser } from "@/lib/demoStore";

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem("userInfo");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

    if (token) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (Array.isArray(response.data)) {
          return {
            success: true,
            orders: response.data,
            totalOrders: response.data.length,
          };
        }

        return response.data;
      } catch {
        // Fall back to browser-persisted demo orders.
      }
    }

    const orders = getDemoOrdersForUser(getStoredUser());
    return {
      success: true,
      orders,
      totalOrders: orders.length,
      demo: true,
    };
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

    if (token) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch {
        // Fall back to local demo order.
      }
    }

    const order = getDemoOrderById(orderId);
    return order || rejectWithValue("Order not found");
  }
);

const initialState = {
  orders: [],
  totalOrders: 0,
  orderDetails: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOrdersState: (state) => {
      state.orders = [];
      state.totalOrders = 0;
      state.orderDetails = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        const rawOrders = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.orders || [];

        state.orders = rawOrders.filter(
          (order) =>
            Array.isArray(order.orderItems) && order.orderItems.length > 0
        );
        state.totalOrders = state.orders.length;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch order details";
      });
  },
});

export const { clearError, resetOrdersState } = ordersSlice.actions;
export default ordersSlice.reducer;
