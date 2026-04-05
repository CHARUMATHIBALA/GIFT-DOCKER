import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function QRPayment({ amount, onSuccess, onCancel }) {
  const { user } = useSelector(state => state.auth)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !isPaid) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isPaid) {
      onCancel()
    }
  }, [timeLeft, isPaid, onCancel])

  const handlePaymentSuccess = () => {
    setIsPaid(true)
    setTimeout(() => {
      onSuccess()
    }, 2000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[2000] p-4">
      <div className="glass-card p-10 max-w-md w-full relative overflow-hidden border-white/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent opacity-50"></div>
        
        {!isPaid ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-1">Scan to Pay</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-8">Quick & Secure Checkout</p>
            
            <div className="mb-8">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Amount</div>
              <div className="text-3xl font-bold text-gold-primary">₹{amount.toLocaleString()}</div>
            </div>

            <div className="bg-white p-4 rounded-3xl inline-block mb-8 shadow-[0_0_50px_rgba(197,160,89,0.15)]">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RoyalGiftsPay_${amount}`} 
                alt="Payment QR" 
                className="w-48 h-48"
              />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Payment will be detected automatically</p>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse"></div>
                  <span className={`text-sm font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white/60'}`}>
                    {timeLeft} sec
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full btn btn-primary py-4 rounded-2xl text-sm"
                >
                  Simulate Success
                </button>
                <button
                  onClick={onCancel}
                  className="w-full text-white/40 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel Transaction
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <div className="text-3xl font-bold text-gold-primary mb-2">₹{amount.toLocaleString()}</div>
            <p className="text-white/40 text-sm mb-10">Payment has been received successfully.<br />Thank you for your order!</p>
            
            <button
              onClick={onSuccess}
              className="w-full btn btn-primary py-4 rounded-2xl text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
