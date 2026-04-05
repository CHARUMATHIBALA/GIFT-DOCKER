import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { fetchMyOrders } from "../features/orderSlice"
import { logout } from "../features/authSlice"

export default function Orders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { myOrders } = useSelector(state => state.orders)
  const [showQR, setShowQR] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [paymentTimer, setPaymentTimer] = useState(20)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    dispatch(fetchMyOrders())
    
    // Set up real-time updates
    const interval = setInterval(() => {
      dispatch(fetchMyOrders())
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    let timer
    if (showQR && paymentTimer > 0) {
      timer = setTimeout(() => {
        setPaymentTimer(paymentTimer - 1)
      }, 1000)
    } else if (showQR && paymentTimer === 0) {
      alert('Payment successful! 🎉 Order will be delivered soon.')
      setShowQR(false)
      setPaymentTimer(20)
      dispatch(fetchMyOrders())
    }
    return () => clearTimeout(timer)
  }, [showQR, paymentTimer, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handlePayment = (order) => {
    setSelectedOrder(order)
    setShowQR(true)
    setPaymentTimer(20)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'badge-success'
      case 'processing':
        return 'bg-gold-primary/10 text-gold-primary'
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400'
      default:
        return 'bg-white/5 text-white/40'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return '✓'
      case 'processing':
        return '○'
      case 'shipped':
        return '→'
      default:
        return '•'
    }
  }

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'processing':
        return 25
      case 'shipped':
        return 75
      case 'delivered':
        return 100
      default:
        return 0
    }
  }

  const getOrderTimeline = (status) => {
    const timeline = [
      { status: 'Order Placed', completed: true, time: 'Just now' },
      { status: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status), time: status === 'processing' ? 'In progress' : 'Completed' },
      { status: 'Shipped', completed: ['shipped', 'delivered'].includes(status), time: status === 'shipped' ? 'In transit' : 'Completed' },
      { status: 'Delivered', completed: status === 'delivered', time: status === 'delivered' ? 'Completed' : 'Pending' }
    ]
    return timeline
  }

  return (
    <div className="min-h-screen">
      <header className="navbar">
        <div className="max-w-5xl mx-auto px-4">
          <div className="navbar-inner py-4">
            <Link to="/dashboard" className="flex items-center space-x-2 shrink-0">
              <span className="text-2xl font-bold gold-text font-display tracking-[0.12em]">ROYAL GIFTS</span>
            </Link>

            <nav className="navbar-center-nav items-center">
              <Link to="/dashboard" className="nav-link active">Dashboard</Link>
              <Link to="/products" className="nav-link">Shop</Link>
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
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/profile')}
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
                  onClick={handleLogout}
                  className="btn btn-outline py-2 px-6 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {myOrders.length === 0 ? (
          <div className="text-center py-24 glass-card max-w-md mx-auto">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
            <p className="text-white/40 mb-8">Start your luxury collection today!</p>
            <button
              onClick={() => navigate('/products')}
              className="btn btn-primary w-full py-4 rounded-xl"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Order Stats */}
            <div className="stat-grid">
              <div className="stat-card">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Total Orders</div>
                <div className="stat-value text-white">{myOrders.length}</div>
              </div>
              <div className="stat-card">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Delivered</div>
                <div className="stat-value text-green-400">
                  {myOrders.filter(o => o.status === 'delivered').length}
                </div>
              </div>
              <div className="stat-card">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">In Progress</div>
                <div className="stat-value text-gold-primary">
                  {myOrders.filter(o => o.status !== 'delivered').length}
                </div>
              </div>
            </div>

            {/* Order List */}
            <div className="space-y-8">
              {myOrders.map((order) => (
                <div key={order._id} className="glass-card overflow-hidden">
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-xl font-bold text-white">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </h3>
                          <span className={`badge ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-white/40 text-xs">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-gold-primary">₹{order.total?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Progress & Timeline */}
                      <div>
                        <div className="mb-8">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Shipment Status</span>
                            <span className="text-xs font-bold text-white">{getProgressPercentage(order.status)}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-gold-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                              style={{ width: `${getProgressPercentage(order.status)}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-6">
                          {getOrderTimeline(order.status).map((step, index) => (
                            <div key={index} className="flex items-start">
                              <div className="relative flex flex-col items-center mr-4">
                                <div className={`w-3 h-3 rounded-full z-10 ${step.completed ? 'bg-gold-primary shadow-[0_0_10px_rgba(197,160,89,0.8)]' : 'bg-white/10'}`} />
                                {index < 3 && <div className={`w-0.5 h-10 -mb-6 ${step.completed ? 'bg-gold-primary/30' : 'bg-white/5'}`} />}
                              </div>
                              <div className="flex-1 -mt-1">
                                <div className="flex justify-between items-center">
                                  <span className={`text-sm font-bold ${step.completed ? 'text-white' : 'text-white/20'}`}>
                                    {step.status}
                                  </span>
                                  <span className="text-[10px] text-white/20 uppercase tracking-widest">{step.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Order Items</h4>
                        <div className="space-y-4">
                          {order.products?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-white/40">
                                  {i + 1}
                                </div>
                                <span className="text-white/80 font-medium">{item.name}</span>
                                <span className="text-white/20">× {item.quantity}</span>
                              </div>
                              <span className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-white font-bold">Grand Total</span>
                            <span className="text-lg font-bold text-gold-primary">₹{order.total?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
