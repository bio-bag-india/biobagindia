import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Clock, Award, Recycle } from 'lucide-react';
import cpcbLogo from '@/assets/cpcb-logo.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden gradient-nature">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full animate-blob filter blur-3xl" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-accent/20 rounded-full animate-blob animation-delay-200 filter blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary/15 rounded-full animate-blob animation-delay-400 filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">CPCB Certified Manufacturer</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-in-up">
              I'm Not A
              <span className="text-gradient block">Plastic Bag</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg animate-fade-in-up animation-delay-200">
              100% Biodegradable & Compostable bags made from corn starch. 
              <strong className="text-foreground"> 180 days</strong> is all it takes to decompose completely.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-400">
              <Link to="/order">
                <Button variant="hero" size="xl">
                  Place Your Order
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="xl">
                  View Products
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up animation-delay-600">
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="w-12 h-12 gradient-hero rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">180</p>
                <p className="text-sm text-muted-foreground">Days to Decompose</p>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="w-12 h-12 gradient-hero rounded-full flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Corn Starch Based</p>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="w-12 h-12 gradient-hero rounded-full flex items-center justify-center mx-auto mb-2">
                  <Recycle className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">0%</p>
                <p className="text-sm text-muted-foreground">Plastic Content</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square">
              {/* Main circle with leaf pattern */}
              <div className="absolute inset-0 gradient-hero rounded-full animate-float shadow-leaf" />
              <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center">
                <div className="text-center p-8">
                  <Leaf className="w-24 h-24 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-3xl font-bold text-foreground">Say No!</h3>
                  <p className="text-lg text-primary font-semibold">To Plastic Bags</p>
                </div>
              </div>
              
              {/* CPCB Badge */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-card rounded-full shadow-card flex items-center justify-center p-4 animate-float animation-delay-400">
                <img src={cpcbLogo} alt="CPCB Certified" className="w-full h-full object-contain" />
              </div>

              {/* Floating elements */}
              <div className="absolute top-10 -left-10 w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-soft animate-float animation-delay-200">
                <span className="text-accent-foreground font-bold text-sm text-center">Eco<br/>Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
