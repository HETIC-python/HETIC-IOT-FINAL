import json
import os
import traceback

import stripe
from flask import Blueprint, current_app, jsonify, request
from src.extensions import db
from src.models import Order

order_bp = Blueprint("order", __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


@order_bp.route("/orders", methods=["GET"])
def get_orders():
    try:
        orders = Order.query.all()
        return (
            jsonify({"success": True, "data": [order.to_dict() for order in orders]}),
            200,
        )
    except Exception as e:
        current_app.logger.error(f"Error fetching orders: {str(e)}")
        return jsonify({"error": str(e)}), 500


@order_bp.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data = request.get_json()
        customer_info = data.get("customerInfo", {})

        # Create Stripe checkout session with customer info
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            customer_email=customer_info.get("email"),
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "IoT Environment Monitoring Kit",
                            "description": "Complete DIY Environment Monitoring Solution",
                        },
                        "unit_amount": 19900,  # $199.00 in cents
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            shipping_address_collection={
                "allowed_countries": ["FR"],
            },
            success_url=f"{request.host_url}success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{request.host_url}cancel",
        )

        # Create order record with customer info
        order = Order(
            stripe_session_id=checkout_session.id,
            amount=199.00,
            currency="usd",
            status="pending",
            first_name=customer_info.get("firstName"),
            last_name=customer_info.get("lastName"),
            email=customer_info.get("email"),
            mobile=customer_info.get("mobile"),
            shipping_address=customer_info.get("address"),
        )

        db.session.add(order)
        db.session.commit()

        return jsonify({"id": checkout_session.id})

    except Exception as e:
        current_app.logger.error(f"Error creating checkout session: {str(e)}")
        return jsonify({"error": str(e)}), 500


@order_bp.route("/stripe-webhook", methods=["POST"])
def webhook():
    current_app.logger.info("Received webhook request")

    # Get raw payload bytes for signature verification
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature", "")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    current_app.logger.debug(
        f"Webhook secret length: {len(webhook_secret) if webhook_secret else 0}"
    )
    current_app.logger.debug(f"Signature header: {sig_header}")
    current_app.logger.debug(f"Payload size: {len(payload)} bytes")

    try:
        # Verify and construct the event
        event = stripe.Webhook.construct_event(
            payload=payload, sig_header=sig_header, secret=webhook_secret
        )

        current_app.logger.info(f"Webhook event type: {event.type}")

        # Handle the event
        if event.type == "checkout.session.completed":
            session = event.data.object

            # Find the order
            order = Order.query.filter_by(stripe_session_id=session.id).first()

            if order:
                order.status = "completed"
                order.stripe_payment_intent_id = session.payment_intent
                db.session.commit()
                current_app.logger.info(f"Updated order {order.id} to completed")
            else:
                current_app.logger.error(f"Order not found for session {session.id}")

        return jsonify({"status": "success"})

    except ValueError as e:
        current_app.logger.error(f"Invalid payload: {str(e)}")
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError as e:
        current_app.logger.error(f"⚠️ Signature verification failed: {str(e)}")
        current_app.logger.debug(f"Expected secret prefix: whsec_")
        return jsonify({"error": "Invalid signature"}), 400
    except Exception as e:
        current_app.logger.error(f"Error processing webhook: {str(e)}")
        current_app.logger.error(traceback.format_exc())  # Log full traceback
        return jsonify({"error": str(e)}), 500
