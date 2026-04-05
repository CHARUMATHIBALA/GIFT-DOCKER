import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}) => {
    const response = await API.get('/products', { params })
    return response.data
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { getState }) => {
    const token = getState().auth.token
    const response = await API.post('/products', productData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { getState }) => {
    const token = getState().auth.token
    const response = await API.put(`/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { getState }) => {
    const token = getState().auth.token
    await API.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return id
  }
)

const slice = createSlice({
  name: "products",
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload)
      })
  }
})

export default slice.reducer
