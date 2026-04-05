import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
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
              <Link to="/about" className="nav-link active">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
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
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            About <span className="gold-text">Royal Gifts</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Crafting timeless treasures since 1985 from our Coimbatore workshop, where every piece tells a story of elegance and excellence.
          </p>
        </div>

        {/* Story Section */}
        <div className="glass-card p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white mb-6">
                Our <span className="gold-text">Heritage</span>
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                For over three decades, Royal Gifts has been synonymous with luxury and craftsmanship from our Coimbatore workshop. 
                What began as a small family business in the heart of Tamil Nadu has evolved into a celebrated destination 
                for those who appreciate the finer things in life.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                Each piece in our collection is handcrafted by master artisans from Coimbatore who have 
                honed their skills over generations, ensuring that every gift carries the legacy 
                of excellence that defines the Royal name.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600" 
                alt="Royal Gifts Heritage" 
                className="w-64 h-64 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gold-primary/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-primary/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-gold-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.523 4.5-1.747V6.253z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-4">Craftsmanship</h3>
            <p className="text-white/70 leading-relaxed">
              Every piece is meticulously crafted by skilled artisans using traditional techniques passed down through generations.
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-primary/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-gold-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-4">Quality</h3>
            <p className="text-white/70 leading-relaxed">
              We use only the finest materials - pure gold, sterling silver, and precious gems - ensuring lasting beauty and value.
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-primary/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-gold-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.5c0-.828-.672-1.5-1.5-1.5h-6c-.828 0-1.5.672-1.5 1.5v7c0 .828.672 1.5 1.5 1.5h6c.828 0 1.5-.672 1.5-1.5v-7zM21 8.5c0-.828-.672-1.5-1.5-1.5h-6c-.828 0-1.5.672-1.5 1.5v7c0 .828.672 1.5 1.5 1.5h6c.828 0 1.5-.672 1.5-1.5v-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-4">Exclusivity</h3>
            <p className="text-white/70 leading-relaxed">
              Limited editions and custom designs ensure your gift remains as unique and special as the moment it celebrates.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass-card p-8 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold gold-text mb-2">35+</div>
              <div className="text-white/70">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl font-bold gold-text mb-2">10K+</div>
              <div className="text-white/70">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold gold-text mb-2">500+</div>
              <div className="text-white/70">Unique Designs</div>
            </div>
            <div>
              <div className="text-4xl font-bold gold-text mb-2">100%</div>
              <div className="text-white/70">Handcrafted</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Experience the <span className="gold-text">Royal Difference</span>
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover our exclusive collection and find the perfect gift that speaks to your heart.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/products" className="btn btn-primary">
              Explore Collection
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default About
