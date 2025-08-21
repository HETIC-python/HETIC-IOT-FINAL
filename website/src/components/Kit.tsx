interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function Feature({ title, description, icon }: FeatureProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex flex-col">
        <p className="text-gray-600 font-semibold text-left">{title}</p>
        <p className="text-sm text-gray-500 text-left">{description}</p>
      </div>
    </div>
  );
}

export function WhatsIncluded() {
  const items = [
    {
      title: "3× Ruvi Tags",
      description: "Temperature, humidity, and motion sensors",
      icon: (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      title: "Raspberry Pi",
      description: "Pre-configured IoT hub",
      icon: (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      title: "BLE Connection",
      description: "Secure data transfer protocol",
      icon: (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      title: "Air Quality Module",
      description: "High-precision monitoring",
      icon: (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      title: "Custom PCB",
      description: "Plug-and-play assembly",
      icon: (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      title: "Cloud Access",
      description: "Monitoring platform included",
      icon: (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">What's Included:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <Feature
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}

export function KeyFeatures() {
  const features = [
    {
      title: "Real-time data monitoring and visualization",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Secure BLE communication for data integrity",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      title: "Easy-to-use dashboard for managing sensors",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Expandable system for additional sensors",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      title: "Compatible with smart home systems",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-8 px-4 sm:px-0">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Key Features
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-blue-50 rounded-lg transition-all hover:shadow-md"
          >
            <div className="flex-shrink-0">{feature.icon}</div>
            <span className="text-sm sm:text-base text-gray-700">
              {feature.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Why Choose Our IoT Kit?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1998/1998645.png"
            alt="Precision"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">High Precision</h3>
          <p className="text-gray-600">
            Get accurate readings for temperature, humidity, and air quality
            with our advanced sensors.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png"
            alt="Security"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Secure Connection</h3>
          <p className="text-gray-600">
            Enjoy peace of mind with BLE-secured communication for your data.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1567/1567073.png"
            alt="Easy Setup"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Easy Setup</h3>
          <p className="text-gray-600">
            Follow our step-by-step guide to get started in minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
