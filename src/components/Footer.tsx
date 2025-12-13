import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-hero rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Bio Bag India</h3>
                <p className="text-xs opacity-70">100% Biodegradable</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Manufacturing CPCB certified 100% biodegradable and compostable bags from corn starch. 
              Say no to plastic, choose sustainable alternatives.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Home</Link>
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Products</Link>
              <Link to="/about" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">About Us</Link>
              <Link to="/order" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Place Order</Link>
              <Link to="/contact" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Our Products</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Carry Bags</Link>
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Garbage Bags</Link>
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Grocery Bags</Link>
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Courier Bags</Link>
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Nursery Bags</Link>
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-colors">Bio Medical Bags</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-accent" />
                <p className="text-sm opacity-80">
                  Silver Complex, Lothada G.I.D.C.,<br />
                  Umiya Industrial Area, B/h<br />
                  Rajkot - 360024, Gujarat, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <a href="tel:+919974830507" className="text-sm opacity-80 hover:opacity-100 transition-colors">
                  +91 99748 30507
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <a href="mailto:biobagindia48@gmail.com" className="text-sm opacity-80 hover:opacity-100 transition-colors">
                  biobagindia48@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-60">
              © {new Date().getFullYear()} Bio Bag India. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-medium">
                CPCB Certified
              </span>
              <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-medium">
                ISO 9001:2015
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
