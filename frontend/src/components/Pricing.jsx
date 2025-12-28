import { Check, Zap, Crown, Building2, Loader2, CreditCard, Coins, DollarSign } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import API_URL from '../config'

function Pricing({ user, onPaymentSuccess }) {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [processingPayment, setProcessingPayment] = useState(null)
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
    const annualPrice = Math.round(monthlyPrice * 12 * 0.8)
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
      'NGN': 1500,
      'USD': 1,
      'BTC': 0.000016
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
      await handlePayment(plan.name.toLowerCase(), 'USD')
      return
    }
    
    if (plan.price === 'Custom') {
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
        alert(`Successfully activated ${plan} plan!`)
        if (onPaymentSuccess) {
          onPaymentSuccess(plan)
        }
        setShowPaymentModal(false)
      } else {
        if (response.data.payment_url) {
          if (currency === 'BTC') {
            alert(`Please send ${response.data.amount} ${currency} to:\n${response.data.payment_url}\n\nPayment ID: ${response.data.payment_id}`)
          } else {
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
        
        if (data.error === 'Rate limit exceeded' || data.error?.includes('Rate limit')) {
          const resetTime = data.reset_time ? new Date(data.reset_time).toLocaleTimeString() : 'soon'
          const tier = data.tier || 'free'
          const reason = data.reason || 'You\'ve reached your hourly limit'
          errorMessage = `⏱️ Rate limit exceeded (${tier} tier)\n\n${reason}\n\nLimit resets at: ${resetTime}\n\n💡 Upgrade your plan for higher limits!`
        }
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
    <div className="min-h-screen py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-50 mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your security scanning needs
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-950'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors relative ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-950'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Annual
              <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
          
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1 gap-1">
            <button
              onClick={() => setSelectedCurrency('NGN')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                selectedCurrency === 'NGN'
                  ? 'bg-white text-gray-950'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Coins className="w-4 h-4" />
              NGN
            </button>
            <button
              onClick={() => setSelectedCurrency('USD')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                selectedCurrency === 'USD'
                  ? 'bg-white text-gray-950'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              USD
            </button>
            <button
              onClick={() => setSelectedCurrency('BTC')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                selectedCurrency === 'BTC'
                  ? 'bg-white text-gray-950'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              BTC
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isPopular = plan.popular
            
            return (
              <div
                key={index}
                className={`card p-6 ${isPopular ? 'ring-2 ring-yellow-500/50' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-950 px-3 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    plan.color === 'gold' ? 'bg-yellow-500/20 border border-yellow-500/50' :
                    plan.color === 'blue' ? 'bg-blue-500/20 border border-blue-500/50' :
                    plan.color === 'purple' ? 'bg-purple-500/20 border border-purple-500/50' :
                    'bg-gray-800 border border-gray-700'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      plan.color === 'gold' ? 'text-yellow-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-50 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-50">{getPriceInCurrency(plan)}</span>
                    {plan.price !== 0 && plan.price !== 'Custom' && (
                      <span className="text-gray-500 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'mo'}</span>
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
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.length > 0 && (
                    <>
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start gap-2 opacity-50">
                          <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-center text-xs text-gray-500">✗</span>
                          <span className="text-sm text-gray-500 line-through">{limitation}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processingPayment === plan.name.toLowerCase()}
                  className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-yellow-500 text-gray-950 hover:bg-yellow-400'
                      : plan.price === 0
                      ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                      : 'btn-primary'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processingPayment === plan.name.toLowerCase() ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
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

        {paymentError && (
          <div className="card p-4 border-red-500/20 bg-red-500/5 max-w-4xl mx-auto">
            <p className="text-sm text-red-400">{paymentError}</p>
          </div>
        )}

        {showPaymentModal && (
          <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-50 mb-4">Complete Payment</h3>
              <p className="text-sm text-gray-400 mb-6">Choose your payment method:</p>
              
              <div className="space-y-2 mb-6">
                <button
                  onClick={() => handlePayment(paymentData.plan, 'NGN')}
                  className="w-full py-3 px-4 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 hover:bg-gray-800 hover:border-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  Pay with NGN (Paystack/Flutterwave)
                </button>
                <button
                  onClick={() => handlePayment(paymentData.plan, 'USD')}
                  className="w-full py-3 px-4 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 hover:bg-gray-800 hover:border-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Pay with USD (Stripe)
                </button>
                <button
                  onClick={() => handlePayment(paymentData.plan, 'BTC')}
                  className="w-full py-3 px-4 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 hover:bg-gray-800 hover:border-gray-700 transition-colors flex items-center justify-center gap-2"
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
                className="w-full py-2.5 px-4 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="card p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-gray-50 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-200 font-semibold mb-2">Can I change plans later?</h4>
              <p className="text-sm text-gray-400">Yes, you can upgrade or downgrade your plan at any time.</p>
            </div>
            <div>
              <h4 className="text-gray-200 font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-sm text-gray-400">We accept NGN (Paystack/Flutterwave), USD (Stripe), and Bitcoin payments.</p>
            </div>
            <div>
              <h4 className="text-gray-200 font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-sm text-gray-400">Yes, all paid plans come with a 14-day free trial. No credit card required.</p>
            </div>
            <div>
              <h4 className="text-gray-200 font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-sm text-gray-400">Yes, we offer a 30-day money-back guarantee on all paid plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
