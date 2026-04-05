import { useEffect, useState, useMemo, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchMyOrders } from "../features/orderSlice"
import { fetchProducts } from "../features/productSlice"
import { fetchWishlist } from "../features/wishlistSlice"
import { logout } from "../features/authSlice"
import { addToCart } from "../features/cartSlice"
import { toggleWishlist } from "../features/wishlistSlice"

const REWARDS_POINTS = 1250
const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Gold", min: 1500 },
  { name: "Platinum", min: 5000 }
]

const CATEGORY_PRODUCTS = {
  "luxury-decor": [
    { _id: "d1", name: "Crystal Centerpiece", price: 8999, originalPrice: 11999, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600" },
    { _id: "d2", name: "Marble Accent Bowl", price: 4599, originalPrice: 5999, image: "https://images.unsplash.com/photo-1581783898377-1c85bf937426?auto=format&fit=crop&q=80&w=600" },
    { _id: "d3", name: "Gold Leaf Frame", price: 3299, originalPrice: 3999, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600" },
    { _id: "d4", name: "Velvet Cushion Set", price: 2799, originalPrice: 3499, image: "https://images.unsplash.com/photo-1584100936595-c9d1fe332c6c?auto=format&fit=crop&q=80&w=600" }
  ],
  jewelry: [
    { _id: "j1", name: "Heritage Gold Chain", price: 45999, originalPrice: 52999, image: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=600" },
    { _id: "j2", name: "Diamond Stud Set", price: 28999, originalPrice: 33999, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600" },
    { _id: "j3", name: "Pearl Drop Earrings", price: 12999, originalPrice: 15999, image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600" },
    { _id: "j4", name: "Signet Ring", price: 18999, originalPrice: 21999, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600" }
  ],
  "corporate-gifts": [
    { _id: "c1", name: "Executive Pen Set", price: 7999, originalPrice: 9999, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=600" },
    { _id: "c2", name: "Leather Portfolio", price: 6499, originalPrice: 7999, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600" },
    { _id: "c3", name: "Crystal Award", price: 12499, originalPrice: 14999, image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600" },
    { _id: "c4", name: "Desk Clock", price: 5599, originalPrice: 6999, image: "https://images.unsplash.com/photo-1509048191080-d2974ccd6e26?auto=format&fit=crop&q=80&w=600" }
  ],
  "silver-items": [
    { _id: "s1", name: "Sterling Tea Service", price: 24999, originalPrice: 29999, image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=600" },
    { _id: "s2", name: "Silver Candlesticks", price: 8999, originalPrice: 10999, image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=600" },
    { _id: "s3", name: "Engraved Tray", price: 6999, originalPrice: 8499, image: "https://images.unsplash.com/photo-1608501821306-2d99cb43fdf9?auto=format&fit=crop&q=80&w=600" },
    { _id: "s4", name: "Silver Photo Frame", price: 3999, originalPrice: 4999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600" }
  ],
  "festival-gifts": [
    { _id: "f1", name: "Diwali Gift Hamper", price: 4999, originalPrice: 6499, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600" },
    { _id: "f2", name: "Festive Sweet Box", price: 1999, originalPrice: 2499, image: "https://images.unsplash.com/photo-1606312619070-d48b4c652b6c?auto=format&fit=crop&q=80&w=600" },
    { _id: "f3", name: "Artisan Chocolate Tower", price: 3499, originalPrice: 4299, image: "https://images.unsplash.com/photo-1549007994-c12d707e58be?auto=format&fit=crop&q=80&w=600" },
    { _id: "f4", name: "Decorative Lantern Pair", price: 4299, originalPrice: 5299, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=600" }
  ]
}

const CATEGORY_META = [
  { id: "luxury-decor", title: "Luxury Decor", subtitle: "Statement pieces for refined spaces" },
  { id: "jewelry", title: "Jewelry", subtitle: "Timeless gold and precious pieces" },
  { id: "corporate-gifts", title: "Corporate Gifts", subtitle: "Impress clients and partners" },
  { id: "silver-items", title: "Silver Items", subtitle: "Handcrafted sterling collections" },
  { id: "festival-gifts", title: "Festival Gifts", subtitle: "Celebrate every occasion in style" }
]

const FEATURED_FALLBACK = [
  { _id: "fd1", name: "Golden Elephant", price: 24999, originalPrice: 29999, image: "https://images.unsplash.com/photo-1581337204873-ef36aa186caa?auto=format&fit=crop&q=80&w=600" },
  { _id: "fd2", name: "Silver Vase", price: 18999, originalPrice: 24999, image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=600" },
  { _id: "fd3", name: "Artisan Necklace", price: 32999, originalPrice: 39999, image: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=600" },
  { _id: "fd4", name: "Heritage Tea Set", price: 45999, originalPrice: 52999, image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=600" }
]

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export default function UserDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { myOrders } = useSelector(state => state.orders)
  const { items: products, isLoading: productsLoading } = useSelector(state => state.products)
  const { items: wishlistItems } = useSelector(state => state.wishlist)
  const { items: cartItems } = useSelector(state => state.cart)

  const [activeNav, setActiveNav] = useState("dashboard")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [newsletter, setNewsletter] = useState("")

  useEffect(() => {
    dispatch(fetchMyOrders())
    dispatch(fetchProducts({}))
    if (user) dispatch(fetchWishlist())
  }, [dispatch, user])

  const cartCount = useMemo(
    () => cartItems.reduce((n, i) => n + (i.quantity || 1), 0),
    [cartItems]
  )

  const featuredProducts = useMemo(() => {
    if (products?.length >= 4) return products.slice(0, 8)
    return FEATURED_FALLBACK
  }, [products])

  const totalSpent = useMemo(
    () => myOrders.reduce((t, o) => t + (o.total || 0), 0),
    [myOrders]
  )

  const stats = [
    {
      label: "Total Orders",
      value: myOrders.length.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: "Rewards Points",
      value: `${REWARDS_POINTS.toLocaleString()} pts`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      label: "Wishlist Items",
      value: wishlistItems.length.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ]

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { id: "products", label: "Products", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { id: "categories", label: "Categories", icon: "M4 6h16M4 12h16M4 18h7" },
    { id: "orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "wishlist", label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { id: "rewards", label: "Rewards", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
    { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "logout", label: "Logout", icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])

  const onNav = (item) => {
    setActiveNav(item.id)
    if (item.id === "logout") {
      handleLogout()
      return
    }
    if (item.id === "products") {
      navigate("/products")
      closeMobileNav()
      return
    }
    if (item.id === "orders") {
      navigate("/orders")
      closeMobileNav()
      return
    }
    const map = {
      dashboard: "section-overview",
      categories: "section-categories",
      wishlist: "section-wishlist",
      rewards: "section-rewards",
      settings: "section-settings"
    }
    const target = map[item.id]
    if (target) {
      scrollToId(target)
    }
    closeMobileNav()
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, price: product.price }))
  }

  const sortedTiers = [...TIERS].sort((a, b) => a.min - b.min)
  let tierIndex = 0
  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (REWARDS_POINTS >= sortedTiers[i].min) {
      tierIndex = i
      break
    }
  }
  const currentTier = sortedTiers[tierIndex]
  const nextTierUp = sortedTiers[tierIndex + 1]
  const rewardsProgress = nextTierUp
    ? Math.min(
        100,
        ((REWARDS_POINTS - currentTier.min) / (nextTierUp.min - currentTier.min)) * 100
      )
    : 100
  const pointsToNext = nextTierUp ? Math.max(0, nextTierUp.min - REWARDS_POINTS) : 0

  const recentOrders = myOrders.slice(0, 8)

  return (
    <div className="dashboard-container">
      <button
        type="button"
        className="mobile-menu-btn fixed left-4 top-4 z-[250] lg:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={`sidebar-backdrop ${mobileNavOpen ? "visible" : ""}`}
        onClick={closeMobileNav}
        aria-hidden
      />

      <aside className={`royal-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold gold-text tracking-[0.14em]">Royal Gifts</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">Est. Luxury</p>
        </div>

        <div className="royal-profile-card flex flex-col items-center py-5 px-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gold-primary/15 border border-gold-primary/35 flex items-center justify-center text-gold-primary text-xl font-bold mb-3 font-serif">
            {user?.name?.charAt(0).toUpperCase() || "R"}
          </div>
          <p className="text-sm font-semibold text-white text-center">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </p>
          <span className="royal-badge mt-2">Premium member</span>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNav(item)}
              className={`sidebar-item w-full text-left ${activeNav === item.id ? "active" : ""}`}
            >
              <span className="mr-3 flex-shrink-0 opacity-80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-sticky-header">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-serif text-xl md:text-2xl font-bold text-white truncate">Dashboard</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 flex-1 justify-end">
            <div className="relative w-full max-w-xs md:max-w-md">
              <input
                type="search"
                placeholder="Search luxury gifts..."
                className="form-input"
                aria-label="Search"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-primary/35 ring-2 ring-gold-primary/10"
              aria-label="Account"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Member")}&background=d4af37&color=1a1208&size=128`}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="cart-btn"
              aria-label="Shopping cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <div id="section-overview" className="scroll-mt-28">
          <div className="stat-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card-premium">
                <div className="stat-icon-wrap">{stat.icon}</div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45 mb-1">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-14 mb-16" id="section-featured">
          <h2 className="section-title-royal">Featured Products</h2>
          <p className="section-sub-royal">Handpicked pieces for the discerning collector</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(productsLoading ? FEATURED_FALLBACK : featuredProducts).slice(0, 8).map(product => (
              <article key={product._id} className="product-premium-card">
                <div className="product-premium-img">
                  <img src={product.image || "https://via.placeholder.com/400"} alt={product.name} loading="lazy" />
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-base font-semibold text-white mb-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-sm text-white/40 line-through">
                      ₹{(product.originalPrice || product.price * 1.15).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-lg font-bold text-gold-primary">₹{Number(product.price).toLocaleString()}</span>
                  </div>
                  <button type="button" className="w-full btn btn-primary py-3 text-sm rounded-xl" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div id="section-categories" className="scroll-mt-28 space-y-20 mb-20">
          {CATEGORY_META.map(meta => (
            <section key={meta.id}>
              <h2 className="section-title-royal">{meta.title}</h2>
              <p className="section-sub-royal">{meta.subtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORY_PRODUCTS[meta.id].map(product => (
                  <article key={product._id} className="product-premium-card">
                    <div className="product-premium-img">
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="text-base font-semibold text-white mb-2">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-sm text-white/40 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="text-lg font-bold text-gold-primary">₹{product.price.toLocaleString()}</span>
                      </div>
                      <button type="button" className="w-full btn btn-primary py-3 text-sm rounded-xl" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mb-16 scroll-mt-28" id="section-orders">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
            <div>
              <h2 className="section-title-royal">Recent Orders</h2>
              <p className="section-sub-royal mb-0">Track your latest purchases</p>
            </div>
            <button type="button" onClick={() => navigate("/orders")} className="text-gold-primary text-sm font-semibold hover:underline">
              View all orders
            </button>
          </div>
          <div className="table-container overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-16 px-4">
                <p className="text-white/50 font-medium">No orders yet — explore our collections.</p>
                <button type="button" className="mt-6 btn btn-primary px-8 py-3 rounded-xl text-sm" onClick={() => navigate("/products")}>
                  Shop now
                </button>
              </div>
            ) : (
              <table className="table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => {
                    const firstProduct = order.products?.[0]
                    const name = firstProduct?.name || "Gift order"
                    return (
                      <tr key={order._id}>
                        <td className="font-semibold text-white whitespace-nowrap">#{String(order._id).slice(-8).toUpperCase()}</td>
                        <td className="text-white/85 max-w-[200px] truncate">{name}</td>
                        <td className="text-white/55 text-sm whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="font-bold text-gold-primary whitespace-nowrap">₹{order.total?.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${order.status === "delivered" ? "badge-success" : "badge-pending"}`}>
                            {order.status || "Processing"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => navigate("/orders")}
                            className="btn btn-outline py-2 px-4 text-xs whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="glass-card p-6 md:p-10 mb-16 scroll-mt-28 border border-white/10" id="section-rewards">
          <h2 className="section-title-royal">Rewards</h2>
          <p className="section-sub-royal">Earn points on every purchase and unlock exclusive tiers</p>
          <div className="flex flex-wrap justify-between gap-4 mb-6">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Your points</p>
              <p className="text-3xl font-bold text-gold-primary font-serif">{REWARDS_POINTS.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Next tier</p>
              <p className="text-lg font-semibold text-white">
                {pointsToNext > 0
                  ? `${pointsToNext.toLocaleString()} pts to ${nextTierUp.name}`
                  : "Max tier reached"}
              </p>
            </div>
          </div>
          <div className="rewards-track mb-3">
            <div className="rewards-fill" style={{ width: `${rewardsProgress}%` }} />
          </div>
          <p className="text-xs text-white/40 mb-8">{Math.round(rewardsProgress)}% progress toward next milestone</p>
          <div className="tier-grid">
            {TIERS.map(tier => (
              <div key={tier.name} className={`tier-pill ${currentTier.name === tier.name ? "active" : ""}`}>
                <p className="text-xs text-white/45 uppercase tracking-wider mb-1">{tier.name}</p>
                <p className="text-sm font-bold text-white">{tier.min.toLocaleString()}+ pts</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 scroll-mt-28" id="section-wishlist">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
            <div>
              <h2 className="section-title-royal">Wishlist</h2>
              <p className="section-sub-royal mb-0">Saved favorites — add to cart when you are ready</p>
            </div>
            <button type="button" onClick={() => navigate("/wishlist")} className="text-gold-primary text-sm font-semibold hover:underline">
              Open full wishlist
            </button>
          </div>
          {wishlistItems.length === 0 ? (
            <div className="glass-card p-12 text-center border border-white/10">
              <p className="text-white/50 mb-6">Your wishlist is empty.</p>
              <button type="button" className="btn btn-primary px-8 py-3 rounded-xl" onClick={() => navigate("/products")}>
                Discover products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.slice(0, 8).map(product => (
                <article key={product._id} className="product-premium-card">
                  <div className="product-premium-img">
                    <img src={product.image || "https://via.placeholder.com/400"} alt={product.name} loading="lazy" />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="text-base font-semibold text-white mb-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</h3>
                    <p className="text-lg font-bold text-gold-primary mb-4">₹{Number(product.price).toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button type="button" className="flex-1 btn btn-primary py-2.5 text-xs rounded-xl" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline px-3 py-2.5 rounded-xl"
                        onClick={() => dispatch(toggleWishlist(product))}
                        aria-label="Remove from wishlist"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card p-8 md:p-10 mb-8 scroll-mt-28 border border-white/10" id="section-settings">
          <h2 className="section-title-royal">Account &amp; Settings</h2>
          <p className="section-sub-royal">Manage your profile and preferences</p>
          <div className="flex flex-wrap gap-4">
            <button type="button" className="btn btn-outline px-6 py-3 rounded-xl text-sm" onClick={() => navigate("/profile")}>
              Edit profile
            </button>
            <button type="button" className="btn btn-outline px-6 py-3 rounded-xl text-sm" onClick={() => navigate("/payment")}>
              Payment methods
            </button>
          </div>
        </section>

        <footer className="royal-footer -mx-4 px-4 md:px-0">
          <div className="royal-footer-grid max-w-6xl mx-auto mb-10">
            <div>
              <p className="font-serif text-lg font-bold gold-text tracking-wider mb-3">Royal Gifts</p>
              <p className="text-sm text-white/50 leading-relaxed font-medium">
                Curated luxury gifts and timeless pieces. Crafted for those who appreciate the extraordinary.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-primary/90 mb-3">Quick links</p>
              <a href="/products" onClick={e => { e.preventDefault(); navigate("/products") }}>Shop all</a>
              <a href="/orders" onClick={e => { e.preventDefault(); navigate("/orders") }}>Orders</a>
              <a href="/wishlist" onClick={e => { e.preventDefault(); navigate("/wishlist") }}>Wishlist</a>
              <a href="/dashboard" onClick={e => { e.preventDefault(); navigate("/dashboard") }}>Dashboard</a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-primary/90 mb-3">Customer support</p>
              <a href="mailto:support@royalgifts.com">support@royalgifts.com</a>
              <a href="tel:+911800000000">+91 1800-000-0000</a>
              <span className="text-sm text-white/45 block pt-2">Mon–Sat, 10am–7pm IST</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-primary/90 mb-3">Newsletter</p>
              <p className="text-sm text-white/50 mb-3 font-medium">Exclusive drops &amp; member offers.</p>
              <form
                className="flex flex-col sm:flex-row gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  setNewsletter("")
                }}
              >
                <input
                  type="email"
                  value={newsletter}
                  onChange={e => setNewsletter(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 rounded-xl bg-white/5 border border-white/12 px-4 py-2.5 text-sm text-white placeholder:text-white/35"
                />
                <button type="submit" className="btn btn-primary py-2.5 px-5 text-sm rounded-xl whitespace-nowrap">
                  Subscribe
                </button>
              </form>
              <div className="flex gap-2 mt-5">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="X">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-white/35 font-medium pt-6 border-t border-white/10">
            © {new Date().getFullYear()} Royal Gifts. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  )
}
