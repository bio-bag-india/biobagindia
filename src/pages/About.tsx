import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Factory, Leaf, Target, Heart } from 'lucide-react';
import cpcbLogo from '@/assets/cpcb-logo.png';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 gradient-nature relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl" />
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/10 rounded-full filter blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                About Us
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
                Leading the Way in
                <span className="text-gradient block">Sustainable Packaging</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Bio Bag India is committed to providing eco-friendly alternatives to plastic bags, 
                helping businesses and consumers make sustainable choices.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="p-8 bg-background rounded-2xl border border-border">
                <div className="w-14 h-14 gradient-hero rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide affordable, high-quality biodegradable bags that help eliminate plastic pollution. 
                  We aim to make sustainable packaging accessible to every business and household in India.
                </p>
              </div>

              <div className="p-8 bg-background rounded-2xl border border-border">
                <div className="w-14 h-14 gradient-hero rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A plastic-free India where every bag decomposes naturally, leaving no trace behind. 
                  We envision a future where sustainable choices are the norm, not the exception.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-foreground mb-2">5+</p>
                <p className="text-primary-foreground/80">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-foreground mb-2">500+</p>
                <p className="text-primary-foreground/80">Happy Clients</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-foreground mb-2">1M+</p>
                <p className="text-primary-foreground/80">Bags Produced</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-foreground mb-2">100%</p>
                <p className="text-primary-foreground/80">Biodegradable</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Why Choose Bio Bag India?
              </h2>
              <p className="text-lg text-muted-foreground">
                We combine quality, sustainability, and affordability to deliver the best 
                biodegradable packaging solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">CPCB Certified</h4>
                <p className="text-muted-foreground text-sm">
                  All products are certified by Central Pollution Control Board
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Factory className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">Modern Factory</h4>
                <p className="text-muted-foreground text-sm">
                  State-of-the-art manufacturing facility in Gujarat
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">100% Eco-Friendly</h4>
                <p className="text-muted-foreground text-sm">
                  Made from corn starch, completely plastic-free
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">Expert Team</h4>
                <p className="text-muted-foreground text-sm">
                  Dedicated team for quality and customer support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certification */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-background rounded-3xl p-8 md:p-12 border border-border flex flex-col md:flex-row items-center gap-8">
                <img 
                  src={cpcbLogo} 
                  alt="CPCB Certified" 
                  className="w-32 h-32 object-contain"
                />
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                    CPCB Certified Manufacturer
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Bio Bag India is a certified manufacturer under the Central Pollution Control Board (CPCB) 
                    guidelines. Our products meet all the required standards for biodegradability and 
                    compostability, ensuring they decompose safely within 180 days without leaving any 
                    toxic residue.
                  </p>
                  <Link to="/products">
                    <Button variant="hero">
                      View Our Products
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
