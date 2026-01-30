import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useActiveProducts, Product, ProductSize } from '@/hooks/useProducts';
import { ShoppingBag, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryIcons: Record<string, string> = {
  carry: '🛍️',
  garbage: '🗑️',
  grocery: '🥬',
  courier: '📦',
  nursery: '🌱',
  medical: '🏥',
  agriculture: '🌾',
  custom: '✨',
};

// Transform DB product to display format
interface DisplayProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  sizes: { size: string; micron: number; capacity: string; pcsPerKg: number }[];
}

const transformProduct = (product: Product): DisplayProduct => ({
  id: product.id,
  name: product.name,
  description: product.description || '',
  category: product.category,
  features: product.features,
  sizes: (product.sizes || []).map(s => ({
    size: s.size,
    micron: s.micron,
    capacity: s.capacity,
    pcsPerKg: s.pcs_per_kg,
  })),
});

const ProductCard = ({ product }: { product: DisplayProduct }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden border border-border">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{categoryIcons[product.category] || '📦'}</span>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {product.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.features.map((feature, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              <Check className="w-3 h-3" />
              {feature}
            </span>
          ))}
        </div>

        {/* Size Toggle */}
        {product.sizes.length > 0 ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full py-3 px-4 bg-muted rounded-lg text-foreground font-medium hover:bg-muted/80 transition-colors"
          >
            <span>View Available Sizes ({product.sizes.length})</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        ) : (
          <div className="py-3 px-4 bg-muted rounded-lg text-foreground font-medium">
            Put Your Sizes
          </div>
        )}

        {/* Size Table */}
        {isExpanded && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Size (Inch)</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Micron</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Capacity</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Pcs/Kg</th>
                </tr>
              </thead>
              <tbody>
                {product.sizes.map((size, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-2 px-2 font-medium text-foreground">{size.size}</td>
                    <td className="py-2 px-2 text-muted-foreground">{size.micron}</td>
                    <td className="py-2 px-2 text-muted-foreground">{size.capacity}</td>
                    <td className="py-2 px-2 text-muted-foreground">{size.pcsPerKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6">
          <Link to="/order">
            <Button variant="hero" className="w-full">
              <ShoppingBag className="w-4 h-4" />
              Order Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: products = [], isLoading } = useActiveProducts();

  const displayProducts = products.map(transformProduct);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'carry', label: 'Carry Bags' },
    { id: 'garbage', label: 'Garbage Bags' },
    { id: 'grocery', label: 'Grocery Bags' },
    { id: 'courier', label: 'Courier Bags' },
    { id: 'nursery', label: 'Nursery Bags' },
    { id: 'medical', label: 'Medical Bags' },
    { id: 'custom', label: 'Custom Bags' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? displayProducts 
    : displayProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 gradient-nature">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Our Products
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                100% Biodegradable Bags
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore our complete range of CPCB certified compostable bags for every need.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'gradient-hero text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
