import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addToCart, removeFromCart } from "../features/cartSlice"
import { createOrder } from "../features/orderSlice"

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const { isLoading } = useSelector(state => state.orders)

  const updateQuantity = (product, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(product._id))
    } else {
      dispatch(addToCart({ ...product, quantity }))
    }
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
  }

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    const orderData = {
      products: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1
      })),
      total: getTotalPrice()
    }

    try {
      await dispatch(createOrder(orderData)).unwrap()
      // Navigate to payment with the total amount
      navigate('/payment', { state: { amount: getTotalPrice() } })
    } catch (error) {
      alert('Failed to place order: ' + error.message)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-white/40 mb-8">Looks like you haven't added any luxury gifts yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary w-full py-4 rounded-xl"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="navbar">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/products')}
              className="text-white/60 hover:text-gold-primary transition-colors flex items-center text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Products
            </button>
            <h1 className="text-xl font-bold gold-text">SHOPPING CART</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-8">Cart Items ({items.length})</h2>
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="cart-image-container w-16 h-16">
                        <img
                          src={item.image || 'https://via.placeholder.com/150'}
                          alt={item.name}
                          className="cart-image"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-gold-primary font-bold">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
                        <button
                          onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-white">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="text-white/40 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Subtotal</span>
                  <span className="text-white font-bold">₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Shipping</span>
                  <span className="text-green-400 font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-white font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-gold-primary">₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full btn btn-primary py-4 rounded-xl text-sm font-bold shadow-[0_0_30px_rgba(197,160,89,0.1)] mb-6"
              >
                {isLoading ? 'Processing Order...' : 'Proceed to Checkout'}
              </button>
              
              <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/10 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Secure Checkout Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
