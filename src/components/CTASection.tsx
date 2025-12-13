import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Mail, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary-foreground rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-primary-foreground rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary-foreground rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Go Plastic-Free?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join hundreds of businesses making the sustainable switch. Get a custom quote for your 
            biodegradable bag requirements today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/order">
              <Button 
                size="xl" 
                className="bg-card text-primary hover:bg-card/90 shadow-lg hover:shadow-xl transition-all"
              >
                Place Order Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="xl"
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Get Quote
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <a 
              href="tel:+919974830507" 
              className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">+91 99748 30507</span>
            </a>
            <a 
              href="mailto:biobagindia48@gmail.com" 
              className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">biobagindia48@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
