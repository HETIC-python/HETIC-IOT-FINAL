import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-gray-600 mb-8">
          We'll send you an email with tracking information once your IoT kit ships.
        </p>
        <Link 
          to="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
