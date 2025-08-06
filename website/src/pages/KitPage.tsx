import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function KitPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        productId: "prod_123"  // Replace with your actual product ID
      });
      
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');
      
      // Redirect to Stripe checkout
      await stripe.redirectToCheckout({
        sessionId: response.data.id
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">IoT Environment Monitoring Kit</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img 
            src="/src/assets/iot-hero.jpg" 
            alt="IoT Kit" 
            className="w-full h-64 object-cover"
          />
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Complete DIY Environment Monitoring Solution</h2>
              <p className="text-gray-600 mb-4">
                Our IoT kit comes with everything you need to start monitoring your environment:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>High-precision temperature and humidity sensors</li>
                <li>Air quality monitoring components</li>
                <li>Pre-configured Raspberry Pi</li>
                <li>Custom PCB for easy assembly</li>
                <li>Detailed setup guide and documentation</li>
                <li>Access to our cloud monitoring platform</li>
              </ul>
            </div>

            <div className="flex items-center justify-between border-t pt-6">
              <div>
                <p className="text-gray-500">Price</p>
                <p className="text-3xl font-bold">$199.00</p>
              </div>
              
              <button
                onClick={handleBuyNow}
                disabled={isLoading}
                className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {isLoading ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
