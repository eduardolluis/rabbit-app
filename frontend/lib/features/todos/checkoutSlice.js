import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const createLocalCheckout = (checkoutData) => ({
  _id: `DEMO-CHECKOUT-${Date.now()}`,
  id: `DEMO-CHECKOUT-${Date.now()}`,
  ...checkoutData,
  createdAt: new Date().toISOString(),
  demo: true,
});

export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch {
      return createLocalCheckout(checkoutData);
    }
  }
);

const initialState = {
  checkout: null,
  loading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckout: (state, action) => {
      state.checkout = action.payload;
      state.error = null;
    },
    clearCheckout: (state) => {
      state.checkout = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.error = null;
      })
      .addCase(createCheckout.rejected, (state) => {
        state.loading = false;
        state.error = "Checkout failed";
      });
  },
});

export const { setCheckout, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
