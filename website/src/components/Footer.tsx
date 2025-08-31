import {
  ArrowRight,
  FileText,
  Heart,
  Mail,
  MessageCircle,
  Shield,
} from "lucide-react";
import { Button } from "./Button";
import { Link } from "react-router-dom";

interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Live Demo", href: "#demo" },
      { label: "Tech Specs", href: "#specs" },
    ],
  },
  {
    title: "Support",
    links: [
      {
        label: "Help Center",
        href: "#help",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: "Contact Us",
        href: "#contact",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        label: "Live Chat",
        href: "#chat",
        icon: <MessageCircle className="h-4 w-4" />,
      },
      { label: "Warranty", href: "#warranty" },
      { label: "Returns", href: "#returns" },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        label: "Privacy Policy",
        href: "#privacy",
        icon: <Shield className="h-4 w-4" />,
      },
      { label: "Terms of Service", href: "#terms" },
      { label: "Shipping Policy", href: "#shipping" },
      { label: "Refund Policy", href: "#refund" },
    ],
  },
];

function FooterSection({ title, links }: FooterSection) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              {link.icon}
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 border-t">
      {/* Call-to-action Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Workspace?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of remote workers who've optimized their environment
            for peak productivity. Your perfect workspace is just one kit away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to={"/kit"}>
              <Button
                size="lg"
                variant="default"
                className="text-lg px-8 py-4 h-auto"
              >
                Order Your Kit - $199
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 h-auto"
            >
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
      </section>

      {/* Footer Links Section */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <h3 className="font-bold text-foreground mb-4">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  EnviroSense
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Professional-grade environmental monitoring made simple for
                remote workers everywhere.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-accent" />
                <span>Made with care for productivity</span>
              </div>
            </div>

            {/* Dynamic Footer Sections */}
            {footerSections.map((section, index) => (
              <FooterSection
                key={index}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 Sentio. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
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
