import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/todos/authSlice";
import productReducer from "./features/todos/productsSlice";
import cartReducer from "./features/todos/cartSlice";
import checkoutReducer from "./features/todos/checkoutSlice";
import orderReducer from "./features/todos/orderSlice";
import adminReducer from "./features/todos/adminSlice";
import adminProductReducer from "./features/todos/adminProductSlice";
import adminOrderReducer from "./features/todos/adminOrderSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    order : orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
