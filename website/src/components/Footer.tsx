import { ArrowRight, Mail, MessageCircle, FileText, Shield, Heart } from "lucide-react";
import { Button } from "./../components/Button";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 border-t">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Workspace?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of remote workers who've optimized their environment for peak productivity. 
              Your perfect workspace is just one kit away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="default" className="text-lg px-8 py-4 h-auto">
                Order Your Kit - $199
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto">
                Schedule Demo Call
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Free worldwide shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Ships in 2-3 business days</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  EnviroSense
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Professional-grade environmental monitoring made simple for remote workers everywhere.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-accent" />
                <span>Made with care for productivity</span>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-primary transition-colors">Live Demo</a></li>
                <li><a href="#specs" className="hover:text-primary transition-colors">Tech Specs</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#help" className="hover:text-primary transition-colors flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#chat" className="hover:text-primary transition-colors flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Live Chat
                  </a>
                </li>
                <li><a href="#warranty" className="hover:text-primary transition-colors flex items-center gap-2">Warranty</a></li>
                <li><a href="#returns" className="hover:text-primary transition-colors flex items-center gap-2">Returns</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#privacy" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Privacy Policy
                  </a>
                </li>
                <li><a href="#terms" className="hover:text-primary transition-colors flex items-center gap-2">Terms of Service</a></li>
                <li><a href="#shipping" className="hover:text-primary transition-colors flex items-center gap-2">Shipping Policy</a></li>
                <li><a href="#refund" className="hover:text-primary transition-colors flex items-center gap-2">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 EnviroSense. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>🌱 Carbon neutral shipping</span>
              <span>🔒 Secure checkout</span>
              <span>📱 iOS & Android apps</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}