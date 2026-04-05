
import { createSlice } from "@reduxjs/toolkit"

const CART_PERSISTENCE_KEY = 'giftshop-cart'

const getInitialState = () => {
  try {
    const persistedCart = localStorage.getItem(CART_PERSISTENCE_KEY)
    if (persistedCart) {
      const parsed = JSON.parse(persistedCart)
      return {
        items: parsed.items || [],
        totalItems: parsed.totalItems || 0,
        totalPrice: parsed.totalPrice || 0,
        isOpen: false,
        isLoading: false,
        lastUpdated: parsed.lastUpdated || Date.now()
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  
  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isOpen: false,
    isLoading: false,
    lastUpdated: Date.now()
  }
}

const saveToLocalStorage = (state) => {
  try {
    const cartData = {
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      lastUpdated: Date.now()
    }
    localStorage.setItem(CART_PERSISTENCE_KEY, JSON.stringify(cartData))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

const slice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existingItem = state.items.find(item => item._id === product._id)
      
      if (existingItem) {
        existingItem.quantity += 1
        existingItem.totalPrice = existingItem.price * existingItem.quantity
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          totalPrice: product.price,
          addedAt: Date.now()
        })
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      state.lastUpdated = Date.now()
      
      // Save to localStorage
      saveToLocalStorage(state)
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item._id !== productId)
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      state.lastUpdated = Date.now()
      
      // Save to localStorage
      saveToLocalStorage(state)
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item._id === id)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item._id !== id)
        } else {
          item.quantity = quantity
          item.totalPrice = item.price * quantity
        }
        
        // Recalculate totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
        state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
        state.lastUpdated = Date.now()
        
        // Save to localStorage
        saveToLocalStorage(state)
      }
    },
    
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
      state.lastUpdated = Date.now()
      
      // Clear from localStorage
      localStorage.removeItem(CART_PERSISTENCE_KEY)
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    
    loadCartFromStorage: (state) => {
      const savedCart = getInitialState()
      state.items = savedCart.items
      state.totalItems = savedCart.totalItems
      state.totalPrice = savedCart.totalPrice
      state.lastUpdated = savedCart.lastUpdated
    },
    
    mergeCartFromServer: (state, action) => {
      const serverCart = action.payload
      state.items = serverCart.items || []
      state.totalItems = serverCart.totalItems || 0
      state.totalPrice = serverCart.totalPrice || 0
      state.lastUpdated = Date.now()
      
      // Save merged cart to localStorage
      saveToLocalStorage(state)
    },
    
    applyCoupon: (state, action) => {
      const { discount, type } = action.payload
      let discountAmount = 0
      
      if (type === 'percentage') {
        discountAmount = (state.totalPrice * discount) / 100
      } else if (type === 'fixed') {
        discountAmount = Math.min(discount, state.totalPrice)
      }
      
      state.couponDiscount = discountAmount
      state.finalTotal = state.totalPrice - discountAmount
    },
    
    removeCoupon: (state) => {
      state.couponDiscount = 0
      state.finalTotal = state.totalPrice
    }
  }
})

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCart, 
  setLoading, 
  loadCartFromStorage,
  mergeCartFromServer,
  applyCoupon,
  removeCoupon
} = slice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotalItems = (state) => state.cart.totalItems
export const selectCartTotalPrice = (state) => state.cart.totalPrice
export const selectCartIsOpen = (state) => state.cart.isOpen
export const selectCartIsLoading = (state) => state.cart.isLoading
export const selectCartFinalTotal = (state) => state.cart.finalTotal || state.cart.totalPrice
export const selectCartDiscount = (state) => state.cart.couponDiscount || 0

export default slice.reducer
