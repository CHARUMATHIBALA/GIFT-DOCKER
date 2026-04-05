import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    // Here you would typically send the data to your backend
    alert('Thank you for contacting Royal Gifts. We will get back to you within 24 hours.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="navbar">
        <div className="max-w-7xl mx-auto px-4">
          <div className="navbar-inner py-4">
            <Link to="/products" className="flex items-center space-x-2 shrink-0">
              <span className="text-2xl font-bold gold-text font-display tracking-[0.12em]">ROYAL GIFTS</span>
            </Link>

            <nav className="navbar-center-nav items-center">
              <Link to="/products" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link active">Contact</Link>
            </nav>

            <div className="flex items-center space-x-4 shrink-0">
              <button
                onClick={() => window.location.href = '/cart'}
                className="relative p-2 text-gold-primary hover:text-white transition-colors hover:bg-gold-primary/20 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="btn btn-outline py-2 px-6 text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => window.location.href = '/register'}
                  className="btn btn-primary py-2 px-6 text-sm"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Get in <span className="gold-text">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Whether you're looking for a custom piece or have questions about our collection, 
            our luxury consultants are here to assist you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="glass-card p-8">
            <h2 className="text-3xl font-serif font-bold text-white mb-8">
              Send us a <span className="gold-text">Message</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div>
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input resize-none"
                  rows="6"
                  placeholder="Tell us about your requirements..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full py-4 text-lg"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                Visit Our <span className="gold-text">Showroom</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-gold-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <div className="text-white font-semibold mb-1">Address</div>
                    <div className="text-white/70">
                      123 Trichy Road, RS Puram<br />
                      Coimbatore, Tamil Nadu 641002<br />
                      India
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-gold-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 001.21.502l4.493 1.498a1 1 0 00.684-.949V19a2 2 0 01-2-2h-1C9.716 17 9 17.716 9 18.716V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-1.284c0-.536.364-1.657.948-1.657H5a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="text-white font-semibold mb-1">Phone</div>
                    <div className="text-white/70">
                      +91 80 1234 5678<br />
                      Mon-Sat: 10:00 AM - 8:00 PM
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-gold-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-white font-semibold mb-1">Email</div>
                    <div className="text-white/70">
                      info@royalgifts.com<br />
                      support@royalgifts.com
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                Business <span className="gold-text">Hours</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Monday - Friday</span>
                  <span className="text-white font-semibold">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Saturday</span>
                  <span className="text-white font-semibold">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Sunday</span>
                  <span className="text-white font-semibold">11:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                Follow <span className="gold-text">Us</span>
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-gray-900 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v8.385C8.612 22.954 12.073 18.073 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-gray-900 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.965 4.965 0 00-2.825.775l.075-.068a10 10 0 011.63 6.34l-4.152 4.153 4.148 4.148a10 10 0 006.34 1.63l.068.075a10 10 0 01.775 2.825 4.965 4.965 0 002.827-.775l4.147-4.147a10 10 0 01-1.63-6.34l-4.15-4.15z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-gray-900 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.266 4.372.735.368.675.567 1.809.567 1.809 0 1.439-.735 1.809-.567.788-.469 1.168-.469 1.168 0 1.178-.469 1.809-.567C15.416 2.429 14.796 2.163 12 2.163zm-3.633 3.819l-1.341 2.416c-.188.329-.428.571-.674.571-1.049 0-1.828-1.496-3.313-3.313-3.313-1.828 0-3.313 1.496-3.313 3.313 0 .476.193.705.571 1.049l1.342 2.416C9.193 9.368 10.453 8.5 12 8.5c1.547 0 2.807.868 4.333 2.482l1.342-2.416c.378-.675.571-1.571.571-1.049 0-1.828-1.496-3.313-3.313-3.313-1.828 0-3.313 1.496-3.313 3.313z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="glass-card p-8">
          <h2 className="text-3xl font-serif font-bold text-white mb-8 text-center">
            Find Our <span className="gold-text">Location</span>
          </h2>
          <div className="rounded-2xl overflow-hidden h-96 bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gold-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <p className="text-white/70">Interactive Map</p>
              <p className="text-white/50 text-sm mt-2">123 Trichy Road, RS Puram, Coimbatore</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact
