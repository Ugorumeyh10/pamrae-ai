import { Check, Zap, Crown, Building2, Loader2, CreditCard, Coins, DollarSign } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import API_URL from '../config'

function Pricing({ user, onPaymentSuccess }) {
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' or 'annual'
  const [selectedCurrency, setSelectedCurrency] = useState('USD') // 'NGN', 'USD', 'BTC'
  const [processingPayment, setProcessingPayment] = useState(null) // plan being processed
  const [paymentError, setPaymentError] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState(null)

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Zap,
      color: 'gray',
      features: [
        '10 scans per day',
        '3 scans per hour',
        'Basic vulnerability detection',
        'PDF reports',
        'Community support'
      ],
      limitations: [
        'Batch size: 1 contract',
        'No ML predictions',
        'No webhooks',
        'No custom rules',
        'No team features'
      ]
    },
    {
      name: 'Basic',
      price: 9,
      period: billingCycle,
      icon: Zap,
      color: 'blue',
      features: [
        '100 scans per day',
        '20 scans per hour',
        'All vulnerability detection',
        'PDF reports',
        'Scan history & trends',
        'Email support',
        'Batch size: 5 contracts'
      ],
      limitations: [
        'No ML predictions',
        'No webhooks',
        'No custom rules',
        'No team features'
      ]
    },
    {
      name: 'Pro',
      price: 29,
      period: billingCycle,
      icon: Crown,
      color: 'gold',
      popular: true,
      features: [
        '1,000 scans per day',
        '100 scans per hour',
        'All vulnerability detection',
        'ML-powered predictions',
        'Webhook notifications',
        'Custom security rules',
        'Team collaboration',
        'Priority support',
        'Batch size: 50 contracts',
        'API access'
      ],
      limitations: []
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'custom',
      icon: Building2,
      color: 'purple',
      features: [
        'Unlimited scans',
        'Unlimited team members',
        'All Pro features',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantees',
        'White-label options',
        'Advanced analytics',
        'Batch size: 200+ contracts',
        'Custom API limits'
      ],
      limitations: []
    }
  ]

  const getPrice = (plan) => {
    if (plan.price === 0) return 'Free'
    if (plan.price === 'Custom') return 'Custom'
    const monthlyPrice = plan.price
    const annualPrice = Math.round(monthlyPrice * 12 * 0.8) // 20% discount
    return billingCycle === 'monthly' ? `$${monthlyPrice}` : `$${Math.round(annualPrice / 12)}`
  }

  const getAnnualSavings = (plan) => {
    if (plan.price === 0 || plan.price === 'Custom') return null
    return `Save $${Math.round(plan.price * 12 * 0.2)}/year`
  }

  const getPriceInCurrency = (plan) => {
    if (plan.price === 0) return 'Free'
    if (plan.price === 'Custom') return 'Custom'
    
    const exchangeRates = {
      'NGN': 1500, // 1 USD = 1500 NGN
      'USD': 1,
      'BTC': 0.000016 // Approximate BTC value
    }
    
    const monthlyPrice = plan.price
    const annualPrice = Math.round(monthlyPrice * 12 * 0.8)
    const price = billingCycle === 'monthly' ? monthlyPrice : Math.round(annualPrice / 12)
    
    if (selectedCurrency === 'NGN') {
      return `₦${Math.round(price * exchangeRates.NGN).toLocaleString()}`
    } else if (selectedCurrency === 'BTC') {
      return `${(price * exchangeRates.BTC).toFixed(8)} BTC`
    } else {
      return `$${price}`
    }
  }

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) {
      // Free plan - activate directly
      await handlePayment(plan.name.toLowerCase(), 'USD')
      return
    }
    
    if (plan.price === 'Custom') {
      // Enterprise - show contact form
      alert('Please contact sales@pamrae.ai for enterprise pricing')
      return
    }
    
    setShowPaymentModal(true)
    setPaymentData({ plan: plan.name.toLowerCase() })
  }

  const handlePayment = async (plan, currency) => {
    setProcessingPayment(plan)
    setPaymentError(null)
    
    try {
      const apiKey = localStorage.getItem('pamrae_api_key')
      if (!apiKey && plan !== 'free') {
        setPaymentError('Please sign in to subscribe')
        setProcessingPayment(null)
        return
      }
      
      const response = await axios.post(
        `${API_URL}/api/v1/payments/create`,
        {
          plan: plan,
          currency: currency || selectedCurrency,
          amount: null
        },
        {
          headers: {
            'X-API-Key': apiKey || 'demo'
          }
        }
      )
      
      if (response.data.status === 'completed' || plan === 'free') {
        // Payment completed or free plan
        alert(`Successfully activated ${plan} plan!`)
        if (onPaymentSuccess) {
          onPaymentSuccess(plan)
        }
        setShowPaymentModal(false)
      } else {
        // Redirect to payment URL
        if (response.data.payment_url) {
          if (currency === 'BTC') {
            // Show Bitcoin address
            alert(`Please send ${response.data.amount} ${currency} to:\n${response.data.payment_url}\n\nPayment ID: ${response.data.payment_id}`)
          } else {
            // Open payment gateway
            window.open(response.data.payment_url, '_blank')
            alert('Please complete payment in the new window. Your plan will be activated automatically.')
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      let errorMessage = 'Payment failed. Please try again.'
      
      if (error.response?.data) {
        const data = error.response.data
        
        // Handle rate limit errors specifically
        if (data.error === 'Rate limit exceeded' || data.error?.includes('Rate limit')) {
          const resetTime = data.reset_time ? new Date(data.reset_time).toLocaleTimeString() : 'soon'
          errorMessage = `⏱️ Rate limit exceeded (${data.tier || 'free'} tier)\n\n${data.reason || 'You've reached your hourly limit'}\n\nLimit resets at: ${resetTime}\n\n💡 Upgrade your plan for higher limits!`
        }
        // Handle other error formats
        else if (typeof data.detail === 'string') {
          errorMessage = data.detail
        } else if (typeof data.detail === 'object') {
          errorMessage = JSON.stringify(data.detail)
        } else if (typeof data.message === 'string') {
          errorMessage = data.message
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' 
            ? data.error 
            : JSON.stringify(data.error)
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setPaymentError(errorMessage)
    } finally {
      setProcessingPayment(null)
    }
  }

  return (
    <div className="min-h-screen py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-glow">Choose Your Plan</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan for your security scanning needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="glass-effect rounded-lg p-1 border-glow inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
          
          {/* Currency Selector */}
          <div className="glass-effect rounded-lg p-1 border-glow inline-flex gap-1">
            <button
              onClick={() => setSelectedCurrency('NGN')}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                selectedCurrency === 'NGN'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4" />
              NGN
            </button>
            <button
              onClick={() => setSelectedCurrency('USD')}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                selectedCurrency === 'USD'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              USD
            </button>
            <button
              onClick={() => setSelectedCurrency('BTC')}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                selectedCurrency === 'BTC'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              BTC
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isPopular = plan.popular
            
            return (
              <div
                key={index}
                className={`glass-effect rounded-2xl p-8 border-glow card-hover relative ${
                  isPopular ? 'ring-2' : ''
                }`}
                style={isPopular ? {borderColor: '#FFD700', ringColor: '#FFD700'} : {}}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    plan.color === 'gold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    plan.color === 'blue' ? 'bg-blue-500/20 border border-blue-500/50' :
                    plan.color === 'purple' ? 'bg-purple-500/20 border border-purple-500/50' :
                    'bg-white/10 border border-white/20'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      plan.color === 'gold' ? 'text-black' : 'text-white'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">{getPriceInCurrency(plan)}</span>
                    {plan.price !== 0 && plan.price !== 'Custom' && (
                      <span className="text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'mo'}</span>
                    )}
                  </div>
                  {billingCycle === 'annual' && plan.price !== 0 && plan.price !== 'Custom' && (
                    <p className="text-sm text-green-400">{getAnnualSavings(plan)}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.length > 0 && (
                    <>
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start gap-2 opacity-50">
                          <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-center text-xs">✗</span>
                          <span className="text-gray-400 text-sm line-through">{limitation}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processingPayment === plan.name.toLowerCase()}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
                      : plan.price === 0
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      : 'bg-white text-black hover:bg-gray-200'
                  } hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processingPayment === plan.name.toLowerCase() ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.price === 'Custom' ? 'Contact Sales' : plan.price === 0 ? 'Get Started' : 'Subscribe'}
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Payment Error */}
        {paymentError && (
          <div className="mt-6 glass-effect rounded-lg p-4 border border-red-500/50 max-w-4xl mx-auto">
            <p className="text-red-400 text-sm">{paymentError}</p>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-effect rounded-2xl p-8 border-glow max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">Complete Payment</h3>
              <p className="text-gray-300 mb-6">Choose your payment method:</p>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handlePayment(paymentData.plan, 'NGN')}
                  className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  Pay with NGN (Paystack/Flutterwave)
                </button>
                <button
                  onClick={() => handlePayment(paymentData.plan, 'USD')}
                  className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Pay with USD (Stripe)
                </button>
                <button
                  onClick={() => handlePayment(paymentData.plan, 'BTC')}
                  className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay with Bitcoin
                </button>
              </div>
              
              <button
                onClick={() => {
                  setShowPaymentModal(false)
                  setPaymentError(null)
                }}
                className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded-lg text-gray-300 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 glass-effect rounded-2xl p-8 border-glow max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Can I change plans later?</h4>
              <p className="text-gray-300 text-sm">Yes, you can upgrade or downgrade your plan at any time.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-300 text-sm">We accept NGN (Paystack/Flutterwave), USD (Stripe), and Bitcoin payments.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-gray-300 text-sm">Yes, all paid plans come with a 14-day free trial. No credit card required.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-gray-300 text-sm">Yes, we offer a 30-day money-back guarantee on all paid plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing

