import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { fetchProducts } from "../features/productSlice"
import { addToCart } from "../features/cartSlice"
import { logout } from "../features/authSlice"

// Fallback products to ensure at least 10 items are displayed
const fallbackProducts = [
  {
    _id: 'fallback-1',
    name: 'Golden Necklace Set',
    price: 25000,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1599643447872-73b3a285d5fc?auto=format&fit=crop&q=80&w=400',
    description: 'Elegant gold necklace with matching earrings'
  },
  {
    _id: 'fallback-2',
    name: 'Silver Wine Glasses',
    price: 8500,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1560439016-e060ee3180ba?auto=format&fit=crop&q=80&w=400',
    description: 'Handcrafted silver wine glasses set of 6'
  },
  {
    _id: 'fallback-3',
    name: 'Diamond Ring',
    price: 45000,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    description: 'Luxury diamond engagement ring'
  },
  {
    _id: 'fallback-4',
    name: 'Crystal Vase',
    price: 12000,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400',
    description: 'Hand-cut crystal vase with gold accents'
  },
  {
    _id: 'fallback-5',
    name: 'Gold Pocket Watch',
    price: 18000,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    description: 'Vintage gold pocket watch with chain'
  },
  {
    _id: 'fallback-6',
    name: 'Silver Cutlery Set',
    price: 35000,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400',
    description: 'Premium silver cutlery set for 12 people'
  },
  {
    _id: 'fallback-7',
    name: 'Gold Cufflinks',
    price: 7500,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1599587130485-74b6c2a8d5f9?auto=format&fit=crop&q=80&w=400',
    description: 'Elegant gold cufflinks with engraving'
  },
  {
    _id: 'fallback-8',
    name: 'Crystal Chandelier',
    price: 85000,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400',
    description: 'Luxury crystal chandelier with gold trim'
  },
  {
    _id: 'fallback-9',
    name: 'Silver Bracelet',
    price: 15000,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1611085583226-4a5ba418548c?auto=format&fit=crop&q=80&w=400',
    description: 'Elegant silver bracelet with intricate design'
  },
  {
    _id: 'fallback-10',
    name: 'Gold Photo Frame',
    price: 5500,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1586348943529-4c7ceb7e2a9a?auto=format&fit=crop&q=80&w=400',
    description: 'Ornate gold photo frame for family memories'
  },
  {
    _id: 'fallback-11',
    name: 'Crystal Perfume Bottle',
    price: 9500,
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400',
    description: 'Hand-cut crystal perfume bottle with gold cap'
  },
  {
    _id: 'fallback-12',
    name: 'Silver Tea Set',
    price: 28000,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400',
    description: 'Complete silver tea set for elegant serving'
  }
]

export default function Products() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: products, isLoading } = useSelector(state => state.products)
  const { items: cartItems } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)
  const catalogRef = useRef(null)

  useEffect(() => {
    dispatch(fetchProducts({ search, category, minPrice: priceRange.min, maxPrice: priceRange.max, sortBy, sortOrder }))
  }, [dispatch, search, category, priceRange, sortBy, sortOrder])

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  // Filter and sort products, ensuring at least 10 items
  const allProducts = products.length > 0 ? products : fallbackProducts
  
  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.description?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !category || product.category === category
      const matchesPrice = (!priceRange.min || product.price >= priceRange.min) &&
                          (!priceRange.max || product.price <= priceRange.max)
      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === 'price') {
        comparison = a.price - b.price
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt || '2024-01-01') - new Date(b.createdAt || '2024-01-01')
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setPriceRange({ min: '', max: '' })
    setSortBy('name')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  const categories = ['electronics', 'clothing', 'books', 'toys', 'home', 'sports', 'beauty', 'food']

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="navbar">
        <div className="max-w-5xl mx-auto px-4">
          <div className="navbar-inner py-4">
            <Link to="/products" className="flex items-center space-x-2 shrink-0">
              <span className="text-2xl font-bold gold-text font-display tracking-[0.12em]">ROYAL GIFTS</span>
            </Link>

            <nav className="navbar-center-nav items-center">
              <Link to="/products" className="nav-link active">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </nav>

            <div className="flex items-center space-x-4 shrink-0">
              <button
                onClick={() => navigate('/cart')}
                className="relative p-3 text-gold-primary hover:text-white transition-colors hover:bg-gold-primary/20 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-primary text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                    {getCartCount()}
                  </span>
                )}
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                    className="btn btn-outline py-2 px-6 text-sm"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="btn btn-outline py-2 px-6 text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="btn btn-primary py-2 px-6 text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Premium Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="font-serif">Royal</span> Gifts <br />
              <span className="gold-text">for Every Occasion</span>
            </h1>
            <p className="hero-subtitle text-balance">
              Discover our exclusive collection of handcrafted golden and silver treasures, designed to make your most precious moments truly unforgettable.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              <button
                type="button"
                className="btn btn-primary premium-btn"
                onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Shop Collection
              </button>
              <button
                type="button"
                className="btn btn-outline premium-btn-outline"
                onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Catalog
              </button>
            </div>
          </div>
          
          <div className="hero-image-container">
            <div className="hero-image-frame">
              <img 
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200" 
                alt="Luxury gifts — gold and silver presentation" 
                className="hero-image"
              />
            </div>
            <div className="hero-glow hero-glow-1"></div>
            <div className="hero-glow hero-glow-2"></div>
            <div className="hero-glow hero-glow-3"></div>
          </div>
        </div>

        {/* Glassmorphism UI Icon Feature */}
        <div className="glass-card p-12 mb-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="glassmorphism-icon">
                <div className="icon-symbol">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div className="icon-glow"></div>
                <div className="icon-gradient"></div>
              </div>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Modern <span className="gold-text">Luxury</span> Experience
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Experience our premium glassmorphism interface with frosted glass effects, soft gradients, and subtle glows that create a truly modern luxury shopping experience.
            </p>
          </div>
        </div>
        <div className="glass-card p-1 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex items-center p-8 space-x-6">
              <div className="w-16 h-16 rounded-xl bg-gold-primary/15 flex items-center justify-center text-gold-primary border border-gold-primary/30 shadow-lg shadow-gold-primary/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Premium Quality</h3>
                <p className="text-white/60 text-base">Finest materials</p>
              </div>
            </div>
            <div className="flex items-center p-8 space-x-6">
              <div className="w-16 h-16 rounded-xl bg-gold-primary/15 flex items-center justify-center text-gold-primary border border-gold-primary/30 shadow-lg shadow-gold-primary/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Secure Payments</h3>
                <p className="text-white/60 text-base">100% safe & secure</p>
              </div>
            </div>
            <div className="flex items-center p-8 space-x-6">
              <div className="w-16 h-16 rounded-xl bg-gold-primary/15 flex items-center justify-center text-gold-primary border border-gold-primary/30 shadow-lg shadow-gold-primary/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Fast Delivery</h3>
                <p className="text-white/60 text-base">Across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div ref={catalogRef} id="catalog" className="glass-card p-8 mb-12 scroll-mt-28">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search luxury gifts..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-primary transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="absolute left-4 top-4.5 w-6 h-6 text-gold-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline flex items-center px-6"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>

              <select
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold-primary transition-all appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name" className="bg-bg-dark">Sort by Name</option>
                <option value="price" className="bg-bg-dark">Sort by Price</option>
                <option value="createdAt" className="bg-bg-dark">Sort by Date</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40">Category</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-primary"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" className="bg-bg-dark">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-bg-dark">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40">Min Price</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-primary"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40">Max Price</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-primary"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 border-4 border-gold-primary/20 border-t-gold-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading luxury collection...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-24 glass-card">
            <div className="text-6xl mb-6">🎁</div>
            <h2 className="text-2xl font-bold text-white mb-2">No luxury items found</h2>
            <p className="text-white/40 mb-8">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {paginatedProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-4">{product.category || 'Luxury Gift'}</p>
                  
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <span className="text-white/40 line-through text-sm">₹{(product.price * 1.2).toFixed(0)}</span>
                    <span className="text-gold-primary font-bold text-xl">₹{product.price}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn btn-primary py-3 rounded-xl text-sm font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 glass-card hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 glass-card hover:border-gold transition-colors ${
                      currentPage === index + 1
                        ? 'gold-gradient text-bg-dark font-bold'
                        : ''
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 glass-card hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
      </main>
    </div>
  )
}
