import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { loginDemoUser, registerDemoUser } from "@/lib/demoStore";

interface User {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  role?: string;
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

const userFromStorage =
  typeof window !== "undefined" && localStorage.getItem("userInfo")
    ? (JSON.parse(localStorage.getItem("userInfo")!) as User)
    : null;

const initialGuestId =
  typeof window !== "undefined"
    ? localStorage.getItem("guestId") || `guest_${new Date().getTime()}`
    : `guest_${new Date().getTime()}`;

if (typeof window !== "undefined") {
  localStorage.setItem("guestId", initialGuestId);
}

const initialState: AuthState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

const shouldUseDemoFallback = (error: AxiosError<ApiErrorResponse>) => {
  const status = error.response?.status;
  return !error.response || status === 404 || status === 502 || status === 503;
};

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

    if (shouldUseDemoFallback(axiosError)) {
      try {
        const fallback = await loginDemoUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(fallback.user));
        localStorage.setItem("userToken", fallback.token);
        return fallback.user;
      } catch (fallbackError) {
        return rejectWithValue(
          fallbackError instanceof Error ? fallbackError.message : "Login failed"
        );
      }
    }

    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Login failed"
    );
  }
});

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

    if (shouldUseDemoFallback(axiosError)) {
      try {
        const fallback = await registerDemoUser({
          name: userData.name || "Rabbit User",
          email: userData.email,
          password: userData.password,
        });
        localStorage.setItem("userInfo", JSON.stringify(fallback.user));
        localStorage.setItem("userToken", fallback.token);
        return fallback.user;
      } catch (fallbackError) {
        return rejectWithValue(
          fallbackError instanceof Error
            ? fallbackError.message
            : "Registration failed"
        );
      }
    }

    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Registration failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
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
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout, generateNewGuestId, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
