import { 
  Gauge, 
  TrendingUp, 
  Brain, 
  Smartphone, 
  Shield, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Real-time Dashboard",
    description: "Monitor temperature, humidity, and air pressure with live updates every second. Crystal clear data visualization on any device."
  },
  {
    icon: TrendingUp,
    title: "Inside vs Outside Comparison", 
    description: "Side-by-side environmental data helps you understand how external conditions affect your indoor workspace comfort."
  },
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description: "Machine learning algorithms predict temperature changes and suggest optimal adjustments 1-2 hours in advance."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Native mobile apps for iOS and Android with push notifications for important environmental changes."
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your data stays local on your Raspberry Pi. No cloud storage required - complete control over your environmental data."
  },
  {
    icon: Zap,
    title: "Easy DIY Setup",
    description: "Simple 3-step installation process. No technical expertise required - just plug, connect, and start monitoring."
  }
];

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Optimize Your Workspace</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade environmental monitoring made simple. Transform any space into a data-driven productivity hub.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative bg-gradient-card p-8 rounded-2xl border shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}