import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../features/cartSlice'
import { createOrder } from '../features/orderSlice'

export default function PaymentGateway({ orderData, onSuccess, onCancel }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const loadStripeScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true)
      setError('')

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway')
      }

      // Create order on backend
      const orderResponse = await fetch('http://localhost:5000/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          amount: orderData.total * 100, // Razorpay expects amount in paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order')
      }

      const order = await orderResponse.json()

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_demo_key',
        amount: order.amount,
        currency: order.currency,
        name: 'Gift Shop',
        description: 'Purchase of gift items',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verificationResponse = await fetch('http://localhost:5000/api/payments/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            if (verificationResponse.ok) {
              // Create order in system
              await dispatch(createOrder({
                ...orderData,
                paymentId: response.razorpay_payment_id,
                paymentMethod: 'razorpay',
                status: 'paid'
              })).unwrap()

              // Clear cart
              dispatch(clearCart())
              onSuccess(response.razorpay_payment_id)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            setError('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: ''
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            onCancel()
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      setError(error.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true)
      setError('')

      // Load Stripe script
      const scriptLoaded = await loadStripeScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway')
      }

      // Create payment intent on backend
      const response = await fetch('http://localhost:5000/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          amount: orderData.total * 100, // Stripe expects amount in cents
          currency: 'usd'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()

      // Initialize Stripe
      const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key')

      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              name: user?.name || '',
              email: user?.email || ''
            }
          }
        }
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      // Handle successful payment (redirected to return_url)
      onSuccess('stripe_payment')

    } catch (error) {
      setError(error.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleDummyPayment = async () => {
    setIsProcessing(true)
    setError('')

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Create order with dummy payment
        await dispatch(createOrder({
          ...orderData,
          paymentId: `dummy_${Date.now()}`,
          paymentMethod: 'dummy',
          status: 'paid'
        })).unwrap()

        // Clear cart
        dispatch(clearCart())
        onSuccess('dummy_payment')
      } catch (error) {
        setError('Order creation failed. Please try again.')
        setIsProcessing(false)
      }
    }, 2000)
  }

  return (
    <div className="payment-gateway bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
      
      <div className="space-y-4 mb-6">
        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="razorpay"
            checked={paymentMethod === 'razorpay'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">Razorpay</span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Popular</span>
            </div>
            <p className="text-sm text-gray-600">Pay via UPI, Cards, Net Banking</p>
          </div>
        </label>

        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="stripe"
            checked={paymentMethod === 'stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">Stripe</span>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">International</span>
            </div>
            <p className="text-sm text-gray-600">Credit/Debit Cards, Apple Pay</p>
          </div>
        </label>

        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="dummy"
            checked={paymentMethod === 'dummy'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">Dummy Payment</span>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Testing</span>
            </div>
            <p className="text-sm text-gray-600">Simulated payment for testing</p>
          </div>
        </label>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900">
            ${orderData.total.toFixed(2)}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={() => {
              if (paymentMethod === 'razorpay') handleRazorpayPayment()
              else if (paymentMethod === 'stripe') handleStripePayment()
              else if (paymentMethod === 'dummy') handleDummyPayment()
            }}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : (
              `Pay $${orderData.total.toFixed(2)}`
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 Secure payment powered by {paymentMethod === 'razorpay' ? 'Razorpay' : paymentMethod === 'stripe' ? 'Stripe' : 'Dummy Gateway'}</p>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  )
}
