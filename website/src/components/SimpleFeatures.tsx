import { Thermometer, Smartphone, Brain } from "lucide-react";

const features = [
  {
    icon: Thermometer,
    title: "Real-time Monitoring",
    description: "Track temperature, humidity, and air pressure continuously."
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Monitor your environment from anywhere with our app."
  },
  {
    icon: Brain,
    title: "Smart Insights",
    description: "Get AI-powered recommendations for optimal comfort."
  }
];

export function SimpleFeatures() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple Environmental Monitoring
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to start monitoring your indoor environment in one easy-to-use kit.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}