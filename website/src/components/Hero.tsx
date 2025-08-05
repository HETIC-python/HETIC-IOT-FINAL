import { ArrowRight } from "lucide-react";
import { Button } from "./../components/Button";
import iotHero from "./../assets/iot-hero.jpg";
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Monitor Your 
              <span className="text-primary">Environment</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              DIY IoT kit to track temperature, humidity, and air quality in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/kit">
                <Button size="lg" variant="default" className="text-lg px-8 py-4 h-auto">
                  Get Started - $199
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img 
                src={iotHero} 
                alt="IoT Sensor Kit with Raspberry Pi" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}