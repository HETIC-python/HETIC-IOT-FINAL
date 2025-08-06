import os

import stripe
from flask import Blueprint, current_app, jsonify, request
from src.extensions import db
from src.models import Order

order_bp = Blueprint('order', __name__)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@order_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'IoT Environment Monitoring Kit',
                        'description': 'Complete DIY Environment Monitoring Solution',
                    },
                    'unit_amount': 19900,  # $199.00 in cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{request.host_url}success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{request.host_url}cancel",
        )

        #TODO: add user_id to order when user authentication is implemented
        order = Order(
            stripe_session_id=checkout_session.id,
            amount=199.00,
            currency='usd',
            status='pending'
        )
        db.session.add(order)
        db.session.commit()

        return jsonify({'id': checkout_session.id})

    except Exception as e:
        current_app.logger.error(f"Error creating checkout session: {str(e)}")
        return jsonify({'error': str(e)}), 500
