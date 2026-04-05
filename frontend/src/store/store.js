
import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "../features/cartSlice"
import authReducer from "../features/authSlice"
import productReducer from "../features/productSlice"
import orderReducer from "../features/orderSlice"

export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
    orders: orderReducer
  }
})
