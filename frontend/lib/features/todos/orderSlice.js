import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper: obtener token del localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userToken");
  }
  return null;
};

// Thunk: obtener órdenes del usuario
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Asumiendo que response.data tiene la forma { success: true, orders: [...], totalOrders: number }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status;

        return rejectWithValue(
          `${statusCode ? `${statusCode}: ` : ""}${errorMessage}`
        );
      }

      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Thunk: obtener detalles de una orden específica
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status;

        return rejectWithValue(
          `${statusCode ? `${statusCode}: ` : ""}${errorMessage}`
        );
      }

      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Estado inicial
const initialState = {
  orders: [],
  totalOrders: 0,
  orderDetails: null,
  loading: false,
  error: null,
};

// Slice
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
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        const rawOrders = action.payload.orders || [];
        // Filtrar solo órdenes con orderItems no vacíos
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
        console.error("fetchUserOrders rejected:", action.payload);
      })

      // Fetch order details
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
        console.error("fetchOrderDetails rejected:", action.payload);
      });
  },
});

export const { clearError, resetOrdersState } = ordersSlice.actions;
export default ordersSlice.reducer;
