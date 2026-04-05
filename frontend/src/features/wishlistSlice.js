import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

const WISHLIST_PERSISTENCE_KEY = 'giftshop-wishlist'

const getInitialState = () => {
  try {
    const persistedWishlist = localStorage.getItem(WISHLIST_PERSISTENCE_KEY)
    if (persistedWishlist) {
      const parsed = JSON.parse(persistedWishlist)
      return {
        items: parsed.items || [],
        isLoading: false,
        error: null,
        lastUpdated: parsed.lastUpdated || Date.now()
      }
    }
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error)
  }
  
  return {
    items: [],
    isLoading: false,
    error: null,
    lastUpdated: Date.now()
  }
}

const saveToLocalStorage = (state) => {
  try {
    const wishlistData = {
      items: state.items,
      lastUpdated: Date.now()
    }
    localStorage.setItem(WISHLIST_PERSISTENCE_KEY, JSON.stringify(wishlistData))
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error)
  }
}

// Async thunks for server operations
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState }) => {
    const token = getState().auth.token
    if (!token) return { items: [] }
    
    const response = await API.get('/wishlist', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { getState }) => {
    const token = getState().auth.token
    const response = await API.post('/wishlist', { productId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { getState }) => {
    const token = getState().auth.token
    await API.delete(`/wishlist/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return productId
  }
)

const slice = createSlice({
  name: "wishlist",
  initialState: getInitialState(),
  reducers: {
    addToWishlistLocal: (state, action) => {
      const product = action.payload
      const existingItem = state.items.find(item => item._id === product._id)
      
      if (!existingItem) {
        state.items.push({
          ...product,
          addedAt: Date.now()
        })
        state.lastUpdated = Date.now()
        saveToLocalStorage(state)
      }
    },
    
    removeFromWishlistLocal: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item._id !== productId)
      state.lastUpdated = Date.now()
      saveToLocalStorage(state)
    },
    
    clearWishlist: (state) => {
      state.items = []
      state.lastUpdated = Date.now()
      localStorage.removeItem(WISHLIST_PERSISTENCE_KEY)
    },
    
    toggleWishlist: (state, action) => {
      const product = action.payload
      const exists = state.items.find(item => item._id === product._id)
      
      if (exists) {
        state.items = state.items.filter(item => item._id !== product._id)
      } else {
        state.items.push({
          ...product,
          addedAt: Date.now()
        })
      }
      
      state.lastUpdated = Date.now()
      saveToLocalStorage(state)
    },
    
    loadWishlistFromStorage: (state) => {
      const savedWishlist = getInitialState()
      state.items = savedWishlist.items
      state.lastUpdated = savedWishlist.lastUpdated
    },
    
    mergeWishlistFromServer: (state, action) => {
      const serverWishlist = action.payload
      state.items = serverWishlist.items || []
      state.lastUpdated = Date.now()
      saveToLocalStorage(state)
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items || []
        state.lastUpdated = Date.now()
        saveToLocalStorage(state)
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        const product = action.payload.product
        if (product && !state.items.find(item => item._id === product._id)) {
          state.items.push({
            ...product,
            addedAt: Date.now()
          })
        }
        state.lastUpdated = Date.now()
        saveToLocalStorage(state)
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter(item => item._id !== action.payload)
        state.lastUpdated = Date.now()
        saveToLocalStorage(state)
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  }
})

export const { 
  addToWishlistLocal, 
  removeFromWishlistLocal, 
  clearWishlist, 
  toggleWishlist,
  loadWishlistFromStorage,
  mergeWishlistFromServer
} = slice.actions

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistIsLoading = (state) => state.wishlist.isLoading
export const selectWishlistError = (state) => state.wishlist.error
export const selectWishlistItemCount = (state) => state.wishlist.items.length
export const selectIsInWishlist = (state, productId) => 
  state.wishlist.items.some(item => item._id === productId)

export default slice.reducer
