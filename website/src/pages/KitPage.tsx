import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { KeyFeatures, WhatsIncluded, WhyChooseUs } from "../components/Kit";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type Place = google.maps.places.PlaceResult;

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (customerInfo: CustomerInfo) => void;
}

function AddressModal({ isOpen, onClose }: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);

  const handleAddressSubmit = async (customerInfo: CustomerInfo) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: "prod_123",
            customerInfo,
            place,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Redirect to Stripe checkout
      await stripe.redirectToCheckout({
        sessionId: data.id,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      // setShowAddressModal(false);
    }
  };

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [error, setError] = useState<Record<keyof CustomerInfo, string>>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
  });

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!customerInfo.firstName) newErrors.firstName = "First name is required";
    if (!customerInfo.lastName) newErrors.lastName = "Last name is required";
    if (!customerInfo.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!customerInfo.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(customerInfo.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    if (!customerInfo.address) newErrors.address = "Address is required";

    setError(newErrors as CustomerInfo);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                value={customerInfo.firstName}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
              {error.firstName && (
                <p className="text-error text-xs mt-1">{error.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                value={customerInfo.lastName}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
              {error.lastName && (
                <p className="text-error text-xs mt-1">{error.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email{" "}
              <span className="text-xs text-gray-500">
                (Will be used for your dashboard access)
              </span>
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
            {error.email && (
              <p className="text-error text-xs mt-1">{error.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              value={customerInfo.mobile}
              onChange={(e) =>
                setCustomerInfo((prev) => ({
                  ...prev,
                  mobile: e.target.value,
                }))
              }
              placeholder="e.g., 0612345678"
            />
            {error.mobile && (
              <p className="text-error text-xs mt-1">{error.mobile}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Address
            </label>
            <Autocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
              onPlaceSelected={(place) => {
                if (place.formatted_address) {
                  setPlace(place);
                  setCustomerInfo((prev) => ({
                    ...prev,
                    address: place.formatted_address || "",
                  }));
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              defaultValue={customerInfo.address}
              placeholder="Enter your shipping address"
              options={{
                types: ["address"],
                componentRestrictions: { country: "fr" },
              }}
            />
            {error.address && (
              <p className="text-error text-xs mt-1">{error.address}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (isLoading) return;
              if (validateForm()) {
                setIsLoading(true);
                handleAddressSubmit(customerInfo);
              }
            }}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isLoading ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function KitPage() {
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleBuyNow = () => {
    setShowAddressModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          IoT Environment Monitoring Kit
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div>
            <img
              src="/src/assets/iot-hero.jpg"
              alt="IoT Kit"
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Complete DIY Environment Monitoring Solution
            </h2>
            <p className="text-gray-600 mb-6">
              Monitor your environment with precision and ease using our IoT
              Environment Monitoring Kit. This kit is designed for enthusiasts,
              professionals, and anyone looking to track environmental data
              seamlessly.
            </p>

            <WhatsIncluded />

            <KeyFeatures />

            <div className="flex items-center justify-between border-t pt-6">
              <div>
                <p className="text-gray-500">Price</p>
                <p className="text-3xl font-bold">$199.00</p>
              </div>

              <button
                onClick={handleBuyNow}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <WhyChooseUs />
      </div>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </div>
  );
}
