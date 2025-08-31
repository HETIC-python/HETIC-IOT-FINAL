import { Link } from "react-router-dom";
import { Button } from "./../components/Button";
import { Card } from "./../components/Card";
import { Check } from "lucide-react";

const features = [
  "Raspberry Pi + 3 sensors",
  "Mobile app included",
  "Real-time monitoring",
  "AI insights",
  "No monthly fees",
];

export function SimplePricing() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Get Your Kit Today
          </h2>
          <p className="text-muted-foreground">
            Complete IoT monitoring solution, ready to use out of the box.
          </p>
        </div>

        <Card className="max-w-md mx-auto p-8 text-center">
          <div className="text-4xl font-bold text-foreground mb-2">$199</div>
          <p className="text-muted-foreground mb-6">Complete monitoring kit</p>

          <div className="space-y-3 mb-8">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <Link to={"/kit"}>
            <Button size="lg" variant="default" className="w-full">
              Order Now
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            Free shipping • 30-day guarantee
          </p>
        </Card>
      </div>
    </section>
  );
}
