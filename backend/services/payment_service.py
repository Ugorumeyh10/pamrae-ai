"""
Payment Service
Handles payments in NGN, USD, and Bitcoin
"""
import os
import hashlib
import secrets
import json
import time
from typing import Dict, Optional
from pathlib import Path
from datetime import datetime, timedelta

class PaymentService:
    """
    Service for handling payments
    Supports: Free, NGN (Paystack/Flutterwave), USD (Stripe), Bitcoin
    """
    
    def __init__(self, storage_path: str = "data/payments"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        
        # Payment gateway configurations (use environment variables in production)
        self.paystack_public_key = os.getenv("PAYSTACK_PUBLIC_KEY", "pk_test_demo")
        self.flutterwave_public_key = os.getenv("FLUTTERWAVE_PUBLIC_KEY", "FLWPUBK_demo")
        self.stripe_public_key = os.getenv("STRIPE_PUBLIC_KEY", "pk_test_demo")
        
    def create_payment_intent(
        self,
        user_id: str,
        plan: str,
        currency: str,  # 'NGN', 'USD', 'BTC'
        amount: Optional[float] = None
    ) -> Dict:
        """
        Create a payment intent
        Returns: {'payment_id': str, 'amount': float, 'currency': str, 'payment_url': str}
        """
        # Plan pricing
        plan_prices = {
            'free': {'NGN': 0, 'USD': 0, 'BTC': 0},
            'basic': {'NGN': 13500, 'USD': 9, 'BTC': 0.00015},  # ~$9 at current rates
            'pro': {'NGN': 43500, 'USD': 29, 'BTC': 0.00048},  # ~$29
            'enterprise': {'NGN': 0, 'USD': 0, 'BTC': 0}  # Custom pricing
        }
        
        if plan not in plan_prices:
            raise ValueError(f"Invalid plan: {plan}")
        
        if plan == 'free':
            # Free plan - no payment needed
            return {
                'payment_id': f"free_{secrets.token_urlsafe(16)}",
                'amount': 0,
                'currency': currency,
                'status': 'completed',
                'payment_url': None,
                'message': 'Free plan activated'
            }
        
        if plan == 'enterprise':
            # Enterprise - custom pricing
            if not amount:
                raise ValueError("Enterprise plan requires custom amount")
        
        # Get amount
        if not amount:
            amount = plan_prices[plan][currency]
        
        # Generate payment ID
        payment_id = f"pay_{secrets.token_urlsafe(16)}"
        
        # Create payment record
        payment_data = {
            'payment_id': payment_id,
            'user_id': user_id,
            'plan': plan,
            'amount': amount,
            'currency': currency,
            'status': 'pending',
            'created_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + timedelta(hours=24)).isoformat()
        }
        
        # Generate payment URL based on currency
        if currency == 'NGN':
            # Use Paystack or Flutterwave
            payment_url = f"https://paystack.com/pay/{payment_id}"  # Demo URL
        elif currency == 'USD':
            # Use Stripe
            payment_url = f"https://checkout.stripe.com/pay/{payment_id}"  # Demo URL
        elif currency == 'BTC':
            # Bitcoin payment
            payment_url = self._generate_bitcoin_address(payment_id)
        else:
            raise ValueError(f"Unsupported currency: {currency}")
        
        payment_data['payment_url'] = payment_url
        
        # Save payment
        payment_file = self.storage_path / f"payment_{payment_id}.json"
        with open(payment_file, 'w') as f:
            json.dump(payment_data, f, indent=2)
        
        return {
            'payment_id': payment_id,
            'amount': amount,
            'currency': currency,
            'status': 'pending',
            'payment_url': payment_url
        }
    
    def verify_payment(self, payment_id: str) -> Dict:
        """
        Verify payment status
        Returns: {'status': str, 'plan': str, 'user_id': str}
        """
        payment_file = self.storage_path / f"payment_{payment_id}.json"
        if not payment_file.exists():
            raise ValueError("Payment not found")
        
        with open(payment_file, 'r') as f:
            payment = json.load(f)
        
        # In production, verify with payment gateway
        # For demo, we'll simulate verification
        if payment['status'] == 'pending':
            # Simulate payment verification (in production, call gateway API)
            payment['status'] = 'completed'
            payment['completed_at'] = datetime.utcnow().isoformat()
            
            with open(payment_file, 'w') as f:
                json.dump(payment, f, indent=2)
        
        return {
            'status': payment['status'],
            'plan': payment['plan'],
            'user_id': payment['user_id'],
            'amount': payment['amount'],
            'currency': payment['currency']
        }
    
    def _generate_bitcoin_address(self, payment_id: str) -> str:
        """
        Generate a Bitcoin address for payment
        In production, use a Bitcoin payment processor like BTCPay Server
        """
        # Demo Bitcoin address (in production, generate real address)
        hash_obj = hashlib.sha256(payment_id.encode())
        address = f"bc1q{hash_obj.hexdigest()[:34]}"
        return address
    
    def get_payment_history(self, user_id: str) -> list:
        """
        Get user's payment history
        """
        payments = []
        for payment_file in self.storage_path.glob("payment_*.json"):
            try:
                with open(payment_file, 'r') as f:
                    payment = json.load(f)
                    if payment.get('user_id') == user_id:
                        payments.append(payment)
            except:
                continue
        
        return sorted(payments, key=lambda x: x.get('created_at', ''), reverse=True)

