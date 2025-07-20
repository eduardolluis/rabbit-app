import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Tipos
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

interface AdminProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Constantes
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// Thunks
export const fetchAdminProducts = createAsyncThunk<Product[]>(
  "adminProducts/fetchAdminProducts",
  async () => {
    const response = await axios.get(`${API_URL}/api/admin/products`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const createProduct = createAsyncThunk<Product, Partial<Product>>(
  "adminProducts/createProduct",
  async (productData) => {
    const response = await axios.post(
      `${API_URL}/api/admin/products`,
      productData,
      { headers: getAuthHeader() }
    );
    return response.data;
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; productData: Partial<Product> }
>("adminProducts/updateProduct", async ({ id, productData }) => {
  const response = await axios.put(
    `${API_URL}/api/admin/products/${id}`,
    productData,
    { headers: getAuthHeader() }
  );
  return response.data;
});

export const deleteProduct = createAsyncThunk<string, string>(
  "adminProducts/deleteProduct",
  async (id) => {
    await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: getAuthHeader(),
    });
    return id;
  }
);

// Slice
const initialState: AdminProductsState = {
  products: [],
  loading: false,
  error: null,
};

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      })

      // create
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.products.push(action.payload);
        }
      )

      // update
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (product) => product._id === action.payload._id
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        }
      )

      // delete
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.products = state.products.filter(
            (product) => product._id !== action.payload
          );
        }
      );
  },
});

export default adminProductsSlice.reducer;
