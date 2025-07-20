import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Tipos
interface User {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  // Removí [key: string]: any; para eliminar el tipo any
}

interface AuthState {
  user: User | null;
  guestId: string;
  loading: boolean;
  error: string | null;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

interface ApiErrorResponse {
  message: string;
  error?: string;
}

// Retrieve user info and token from localstorage if available (SSR-safe)
const userFromStorage =
  typeof window !== "undefined" && localStorage.getItem("userInfo")
    ? (JSON.parse(localStorage.getItem("userInfo")!) as User)
    : null;

// Check for an existing guest Id in the localstorage or generate a new one (SSR-safe)
const initialGuestId =
  typeof window !== "undefined"
    ? localStorage.getItem("guestId") || `guest_${new Date().getTime()}`
    : `guest_${new Date().getTime()}`;

// Only set localStorage if we're in the browser
if (typeof window !== "undefined") {
  localStorage.setItem("guestId", initialGuestId);
}

// Initial state
const initialState: AuthState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`,
      userData
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
    }

    return response.data.user;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Login failed"
    );
  }
});

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  User,
  { email: string; password: string; name?: string },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`,
      userData
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
    }

    return response.data.user;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Redirecting to Home Page"
    );
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        localStorage.setItem("guestId", state.guestId);
      }
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      if (typeof window !== "undefined") {
        localStorage.setItem("guestId", state.guestId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
