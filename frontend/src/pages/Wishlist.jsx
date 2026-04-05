import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchWishlist, removeFromWishlist, addToWishlist } from "../features/wishlistSlice"
import { addToCart } from "../features/cartSlice"
import { logout } from "../features/authSlice"

export default function Wishlist() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { items: wishlistItems, isLoading } = useSelector(state => state.wishlist)
  const { items: cartItems } = useSelector(state => state.cart)

  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist())
    }
  }, [dispatch, user])

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    setNotification(`${product.name} added to cart!`)
    setTimeout(() => setNotification(''), 3000)
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap()
      setNotification('Item removed from wishlist')
      setTimeout(() => setNotification(''), 3000)
    } catch (error) {
      setNotification('Failed to remove from wishlist')
    }
  }

  const handleMoveToCart = (product) => {
    handleAddToCart(product)
    handleRemoveFromWishlist(product._id)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  const shareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/wishlist/${user?._id}`
    navigator.clipboard.writeText(wishlistUrl)
    setNotification('Wishlist link copied to clipboard!')
    setTimeout(() => setNotification(''), 3000)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-6">👤</div>
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-white/40 mb-8">You need to login to view your wishlist collection.</p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary w-full py-4 rounded-xl"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="navbar">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white/60 hover:text-gold-primary transition-colors flex items-center text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-xl font-bold gold-text uppercase tracking-widest">My Wishlist</h1>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gold-primary hover:text-white transition-colors hover:bg-gold-primary/20 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-primary text-bg-dark rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <button onClick={() => navigate('/products')} className="nav-link text-sm">Shop</button>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Notification */}
        {notification && (
          <div className="fixed top-24 right-8 z-[2000] animate-fade-in">
            <div className="glass-card px-6 py-4 border-gold-primary/30 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
              <p className="text-gold-primary text-sm font-bold flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {notification}
              </p>
            </div>
          </div>
        )}

        {/* Wishlist Header */}
        <div className="glass-card p-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} in Wishlist
              </h2>
              <p className="text-white/40 text-sm">
                Save your favorite luxury items for later
              </p>
            </div>
            <div className="flex space-x-4 w-full md:w-auto">
              <button
                onClick={shareWishlist}
                className="flex-1 md:flex-none btn btn-outline px-6 py-3 text-xs"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
              {wishlistItems.length > 0 && (
                <button
                  onClick={() => {
                    wishlistItems.forEach(item => handleAddToCart(item))
                  }}
                  className="flex-1 md:flex-none btn btn-primary px-8 py-3 text-xs"
                >
                  Add All to Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {isLoading ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 border-4 border-gold-primary/20 border-t-gold-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/40">Loading luxury wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-24 glass-card">
            <div className="text-6xl mb-6">💝</div>
            <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-white/40 mb-8">Start adding luxury items you love to your collection.</p>
            <button
              onClick={() => navigate('/products')}
              className="btn btn-primary px-10 py-4 rounded-xl"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <div key={product._id} className="product-card group">
                <div className="product-image-container relative">
                  <img
                    src={product.image || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="product-image"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="absolute top-4 right-4 p-3 glass rounded-full hover:bg-red-500/20 transition-all group/remove"
                  >
                    <svg className="w-5 h-5 text-red-500 fill-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  
                  {product.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-gold-primary text-bg-dark text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {product.category}
                    </span>
                  )}
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <span className="text-gold-primary font-bold text-xl">₹{product.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full btn btn-primary py-3 rounded-xl text-xs font-bold"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="w-full btn btn-outline py-3 rounded-xl text-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
