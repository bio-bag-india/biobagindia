import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Trash2, Package, Truck, TreePine, Stethoscope } from 'lucide-react';

const productCategories = [
  {
    icon: ShoppingBag,
    name: 'Carry Bags',
    description: 'Perfect for retail & shopping',
    color: 'from-primary to-accent',
  },
  {
    icon: Trash2,
    name: 'Garbage Bags',
    description: 'Eco-friendly waste disposal',
    color: 'from-accent to-primary',
  },
  {
    icon: Package,
    name: 'Grocery Bags',
    description: 'For vegetables & groceries',
    color: 'from-primary to-accent',
  },
  {
    icon: Truck,
    name: 'Courier Bags',
    description: 'Secure e-commerce packaging',
    color: 'from-accent to-primary',
  },
  {
    icon: TreePine,
    name: 'Nursery Bags',
    description: 'Plant-friendly bio bags',
    color: 'from-primary to-accent',
  },
  {
    icon: Stethoscope,
    name: 'Bio Medical Bags',
    description: 'Hospital-grade waste bags',
    color: 'from-accent to-primary',
  },
];

const ProductsPreview = () => {
  return (
    <section className="py-24 gradient-nature">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Our Products
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            100% Plastic Free Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            From daily carry bags to specialized medical waste bags, we have eco-friendly 
            alternatives for every need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCategories.map((product, index) => (
            <Link 
              key={index}
              to="/products"
              className="group p-6 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <product.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {product.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {product.description}
              </p>
              <span className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-3 transition-all">
                View Details
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="hero" size="lg">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
