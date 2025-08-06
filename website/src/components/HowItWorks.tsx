import { Package, Download, Play, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Unbox & Assemble",
    description: "Connect the 3 sensors to your Raspberry Pi using our color-coded cables. Takes less than 10 minutes with our illustrated guide.",
    time: "5-10 min"
  },
  {
    icon: Download,
    title: "Install Mobile App",
    description: "Download our free app for iOS or Android. Scan the QR code on your kit to automatically configure the connection.",
    time: "2 min"
  },
  {
    icon: Play,
    title: "Start Monitoring",
    description: "Place your sensor kit in your workspace and start receiving real-time environmental data and AI-powered insights.",
    time: "Instant"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Ready in Minutes</span>, 
            Monitoring for Life
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No technical expertise required. Our streamlined setup process gets you monitoring your environment in under 20 minutes.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-30" />
            
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className="relative text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-accent">
                  {index + 1}
                </div>
                
                {/* Icon container */}
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-card rounded-2xl border shadow-soft flex items-center justify-center group hover:shadow-glow transition-all duration-300">
                  <step.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Time badge */}
                <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {step.time}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Success message */}
          <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '0.8s' }}>
            <div className="inline-flex items-center gap-3 bg-gradient-card px-6 py-4 rounded-xl border shadow-soft">
              <CheckCircle className="h-6 w-6 text-accent" />
              <span className="text-lg font-medium text-foreground">
                That's it! Your intelligent monitoring system is now active.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}