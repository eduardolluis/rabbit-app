import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper: obtener token del localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userToken");
  }
  return null;
};

// Estado inicial
const initialState = {
  orders: [],
  totalOrders: 0,
  totalSales: 0,
  loading: false,
  error: null,
};

// Obtener todas las órdenes (admin)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue({ message: "No authentication token found" });
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Si la respuesta no tiene la estructura esperada, calcular los valores
      let responseData = res.data;

      if (!responseData.totalSales && responseData.orders) {
        const totalSales = responseData.orders
          .filter((order) => order.isPaid)
          .reduce((sum, order) => sum + order.totalPrice, 0);

        responseData = {
          ...responseData,
          totalSales: totalSales,
        };
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Unexpected error occurred" });
    }
  }
);

// Actualizar el estado de una orden
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue({ message: "No authentication token found" });
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error al actualizar el estado" });
    }
  }
);

// Marcar orden como entregada (admin)
export const markOrderAsDelivered = createAsyncThunk(
  "adminOrders/markDelivered",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue({ message: "No authentication token found" });
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error al marcar como entregado" });
    }
  }
);

// Slice
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAdminOrdersState: (state) => {
      state.orders = [];
      state.totalOrders = 0;
      state.totalSales = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.totalOrders =
          action.payload.totalOrders || action.payload.orders?.length || 0;
        state.totalSales = action.payload.totalSales || 0;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Error al cargar órdenes del administrador.";
        console.error("fetchAllOrders rejected:", action.payload);
      })

      // Actualizar estado de orden
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Error al actualizar el estado de la orden.";
      })

      // Marcar como entregado
      .addCase(markOrderAsDelivered.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markOrderAsDelivered.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        state.loading = false;
      })
      .addCase(markOrderAsDelivered.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error al marcar la orden como entregada.";
      });
  },
});

export const { clearError, resetAdminOrdersState } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
