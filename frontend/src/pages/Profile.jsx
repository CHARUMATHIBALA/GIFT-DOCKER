import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchMyOrders } from "../features/orderSlice"
import { logout, loginSuccess } from "../features/authSlice"
import axios from "axios"

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { myOrders } = useSelector(state => state.orders)
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // In a real app, you'd have an update profile endpoint
      // For now, we'll just update the local state
      dispatch(loginSuccess({
        user: { ...user, ...formData },
        token: localStorage.getItem('token')
      }))
      setMessage('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getTotalSpent = () => {
    return myOrders.reduce((total, order) => total + order.total, 0)
  }

  const getOrderStats = () => {
    const delivered = myOrders.filter(order => order.status === 'delivered').length
    const processing = myOrders.filter(order => order.status === 'processing').length
    return { delivered, processing, total: myOrders.length }
  }

  const stats = getOrderStats()

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
            <h1 className="text-xl font-bold gold-text">MY PROFILE</h1>
            <div className="flex items-center space-x-6">
              <button onClick={() => navigate('/products')} className="nav-link text-sm">Products</button>
              <button onClick={() => navigate('/cart')} className="nav-link text-sm">Cart</button>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-primary opacity-20"></div>
              
              <div className="relative mb-8 inline-block">
                <div className="w-32 h-32 rounded-3xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center overflow-hidden mx-auto">
                  <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=c5a059&color=fff&size=128`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold-primary rounded-xl border-4 border-bg-dark flex items-center justify-center">
                  <svg className="w-3 h-3 text-bg-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-white/40 text-sm mb-6">{user?.email}</p>
              
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-[10px] font-bold text-gold-primary uppercase tracking-widest mb-10">
                {user?.role === 'admin' ? '👑 Administrator' : '👤 Premium Member'}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-primary transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-primary transition-all"
                      required
                    />
                  </div>
                  {message && (
                    <div className={`text-xs font-bold text-center py-2 rounded-lg ${message.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {message}
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 btn btn-primary py-3 text-xs rounded-xl"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({ name: user?.name || '', email: user?.email || '' })
                        setMessage('')
                      }}
                      className="flex-1 btn btn-outline py-3 text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full btn btn-primary py-4 text-sm rounded-xl"
                  >
                    Edit Profile
                  </button>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Member Since</p>
                    <p className="text-white font-bold">
                      {user ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-12">
            {/* Order Stats */}
            <div className="stat-grid">
              <div className="stat-card">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Total Orders</div>
                <div className="stat-value text-white">{stats.total}</div>
              </div>
              <div className="stat-card">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Delivered</div>
                <div className="stat-value text-green-400">{stats.delivered}</div>
              </div>
              <div className="stat-card">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Total Spent</div>
                <div className="stat-value text-gold-primary">₹{getTotalSpent().toLocaleString()}</div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Recent Orders</h3>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-gold-primary text-xs font-bold hover:underline"
                >
                  View All Orders
                </button>
              </div>
              
              <div className="table-container">
                {myOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📦</div>
                    <p className="text-white/40 text-sm">No orders yet</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="mt-6 btn btn-primary py-2 px-8 text-xs rounded-lg"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myOrders.slice(0, 5).map((order) => (
                        <tr key={order._id}>
                          <td className="font-bold text-white">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="text-white/60">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="font-bold text-gold-primary">₹{order.total?.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'delivered' 
                                ? 'badge-success' 
                                : 'bg-gold-primary/10 text-gold-primary'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
