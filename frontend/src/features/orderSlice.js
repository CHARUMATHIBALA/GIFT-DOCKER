import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState }) => {
    const token = getState().auth.token
    const response = await API.post('/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { getState }) => {
    const token = getState().auth.token
    const response = await API.get('/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { getState }) => {
    const token = getState().auth.token
    const response = await API.get('/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

const slice = createSlice({
  name: "orders",
  initialState: {
    myOrders: [],
    allOrders: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.myOrders.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload
      })
  }
})

export default slice.reducer
