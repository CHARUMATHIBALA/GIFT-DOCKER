
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchProducts } from "../features/productSlice"
import { fetchAllOrders } from "../features/orderSlice"
import { logout } from "../features/authSlice"
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { items: products } = useSelector(state => state.products)
  const { allOrders } = useSelector(state => state.orders)
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchAllOrders())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const stats = [
    {
      label: 'Total Users',
      value: '1,245',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      label: 'Total Orders',
      value: allOrders.length.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: 'Total Revenue',
      value: `₹${allOrders.reduce((total, order) => total + (order.total || 0), 0).toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Pending Orders',
      value: allOrders.filter(order => order.status === 'pending').length.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: 'users', label: 'Users', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { id: 'products', label: 'Products', icon: (
      <svg className="w-5 h-5 text-gold-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )},
    { id: 'orders', label: 'Orders', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { id: 'payments', label: 'Payments', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'gifts', label: 'Gifts', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0h4l1 10H7l1-10h4z" />
      </svg>
    )},
    { id: 'reports', label: 'Reports', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'logout', label: 'Logout', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    )}
  ]

  const salesData = [
    { date: 'May 15', sales: 45000, orders: 120 },
    { date: 'May 22', sales: 52000, orders: 145 },
    { date: 'May 29', sales: 48000, orders: 130 },
    { date: 'Jun 5', sales: 61000, orders: 165 },
    { date: 'Jun 12', sales: 67000, orders: 180 }
  ]

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="mb-12">
          <h1 className="text-xl font-bold gold-text tracking-wider">ROYAL GIFTS <span className="text-[10px] text-white/40 block">ADMIN</span></h1>
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === 'logout' ? handleLogout() : setActiveSection(item.id)}
              className={`sidebar-item w-full ${activeSection === item.id ? 'active' : ''}`}
            >
              <span className="mr-3 opacity-70">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 capitalize">{activeSection}</h2>
            <p className="text-white/40 text-sm">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-primary transition-all w-64"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-primary">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {activeSection === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="stat-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-gold-primary/10 text-gold-primary border border-gold-primary/20">
                      {stat.icon}
                    </div>
                    <span className="text-gold-light/80 text-xs font-bold">+12%</span>
                  </div>
                  <div className="stat-value text-white">{stat.value}</div>
                  <div className="text-white/40 text-xs uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Sales Overview Chart */}
              <div className="lg:col-span-2 glass-card p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-white">Sales Overview</h3>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gold-primary mr-2"></div>
                      <span className="text-white/40">Sales</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-silver mr-2" style={{ background: "#c8c8d0" }}></div>
                      <span className="text-white/40">Orders</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                        dy={10}
                      />
                      <YAxis
                        yAxisId="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(20, 16, 14, 0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          backdropFilter: "blur(10px)"
                        }}
                        labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                        formatter={(value) => (value === "sales" ? "Sales (INR)" : "Orders")}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        name="sales"
                        stroke="#d4af37"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4, fill: "#f9e29c", stroke: "#d4af37" }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        name="orders"
                        stroke="#c8c8d0"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "#e8e8ee", stroke: "#a8a8b0" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Orders Side Table */}
              <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Recent Orders</h3>
                  <button className="text-gold-primary text-xs font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {allOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center text-[10px] text-gold-primary font-bold">
                          RG
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">#{order._id?.slice(-6)}</div>
                          <div className="text-[10px] text-white/40">{order.user?.name || 'Guest'}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-gold-primary">₹{order.total?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Sections for other views */}
        {activeSection === 'users' && (
          <div className="table-container">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Manage Users</h3>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-primary"
                />
                <button className="btn btn-primary py-2 px-6 text-sm">Add User</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 32109', orders: 12, joined: '10 Jan 2024' },
                  { name: 'Arjun Patel', email: 'arjun@example.com', phone: '+91 87654 32109', orders: 8, joined: '15 Jan 2024' },
                  { name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 76543 21098', orders: 15, joined: '20 Jan 2024' },
                  { name: 'Karthik R', email: 'karthik@example.com', phone: '+91 65432 10987', orders: 5, joined: '25 Jan 2024' }
                ].map((u, i) => (
                  <tr key={i}>
                    <td className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </td>
                    <td className="text-white/60">{u.email}</td>
                    <td className="text-white/60">{u.phone}</td>
                    <td>{u.orders}</td>
                    <td className="text-white/60">{u.joined}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-gold-primary/10 text-gold-primary rounded-lg hover:bg-gold-primary/20 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'gifts' && (
          <div className="table-container">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Gift Management</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search gifts..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-primary"
                />
                <button type="button" className="btn btn-primary py-2 px-6 text-sm">
                  Add Gift
                </button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Gift</th>
                  <th>Description</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Anniversary Hamper",
                    img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=80",
                    desc: "Curated gold-accent gift box",
                    value: "₹4,999"
                  },
                  {
                    name: "Silver Keepsake",
                    img: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=80",
                    desc: "Engraved silver presentation piece",
                    value: "₹3,299"
                  },
                  {
                    name: "Royal Celebration",
                    img: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=80",
                    desc: "Premium packaging & ribbon",
                    value: "₹7,499"
                  }
                ].map((g, i) => (
                  <tr key={i}>
                    <td className="flex items-center space-x-3">
                      <img src={g.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/5 border border-white/10" />
                      <span className="font-medium text-white">{g.name}</span>
                    </td>
                    <td className="text-white/60 max-w-xs">{g.desc}</td>
                    <td className="font-bold text-gold-primary">{g.value}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button type="button" className="p-2 bg-gold-primary/10 text-gold-primary rounded-lg hover:bg-gold-primary/20 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button type="button" className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'products' && (
          <div className="table-container">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Manage Products</h3>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-primary"
                />
                <button className="btn btn-primary py-2 px-6 text-sm">Add Product</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td className="flex items-center space-x-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="text-white/60">{p.category}</td>
                    <td className="font-bold text-gold-primary">₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-gold-primary/10 text-gold-primary rounded-lg hover:bg-gold-primary/20 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}