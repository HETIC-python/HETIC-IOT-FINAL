import { Hero } from "../components/Hero";
import { SimpleFeatures } from "../components/SimpleFeatures";
import { SimplePricing } from "../components/SimplePricing";
import { Footer } from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SimpleFeatures />
      <SimplePricing />
      <Footer />
    </div>
  );
};

export default HomePage;
