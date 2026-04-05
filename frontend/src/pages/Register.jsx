import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginStart, loginSuccess, loginFailure } from "../features/authSlice"
import axios from "axios"

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
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
      const response = await API.post('/auth/register', formData)
      dispatch(loginSuccess(response.data))
      navigate(response.data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Registration failed'))
    }
  }

  return (
    <div className="auth-page">
      <div className="max-w-md w-full glass-card p-10 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-primary opacity-30"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold gold-text tracking-widest mb-2">ROYAL GIFTS</h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Luxury Gift Collection</p>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-8">Create Account</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-primary transition-all"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-primary transition-all"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-primary transition-all"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">Role</label>
              <select
                name="role"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-primary transition-all appearance-none cursor-pointer"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user" className="bg-bg-dark">User</option>
                <option value="admin" className="bg-bg-dark">Admin</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-4 rounded-xl text-sm font-bold shadow-[0_0_30px_rgba(197,160,89,0.1)] hover:shadow-[0_0_40px_rgba(197,160,89,0.2)] transition-all"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center pt-4">
            <p className="text-xs text-white/40">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-gold-primary font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
