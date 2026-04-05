import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginStart, loginSuccess, loginFailure } from "../features/authSlice"
import axios from "axios"

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector(state => state.auth)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    
    try {
      const response = await API.post('/auth/login', formData)
      dispatch(loginSuccess(response.data))
      navigate(response.data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-primary/3 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full glass-card p-10 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-60"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold gold-text tracking-wider mb-3 font-serif">ROYAL GIFTS</h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium">Luxury Gift Collection</p>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-8">Welcome Back</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="form-input"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center py-4 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-4 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div className="text-center pt-6 border-t border-white/5">
            <p className="text-sm text-white/40">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-gold-primary font-bold hover:text-gold-light transition-colors ml-1"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
