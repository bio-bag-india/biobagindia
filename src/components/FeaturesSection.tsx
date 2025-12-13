import { Leaf, Droplets, Printer, Ruler, Shield, Truck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Made from Corn Starch',
    description: '100% plant-based materials derived from corn starch and bio-polymers. Completely plastic-free.',
  },
  {
    icon: Droplets,
    title: '180 Days Decomposition',
    description: 'Naturally decomposes within 180 days into non-toxic elements, leaving no harmful residue.',
  },
  {
    icon: Shield,
    title: 'CPCB Certified',
    description: 'Fully certified by Central Pollution Control Board (CPCB) for environmental safety standards.',
  },
  {
    icon: Printer,
    title: 'Custom Printing',
    description: 'Get your brand logo and designs printed on bags. Eco-friendly inks and customization available.',
  },
  {
    icon: Ruler,
    title: 'All Custom Sizes',
    description: 'Available in various sizes from small grocery bags to large industrial packaging solutions.',
  },
  {
    icon: Truck,
    title: 'Pan India Delivery',
    description: 'We deliver across India. Bulk orders with competitive pricing and reliable shipping.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Cheaper Than Regular Plastic
          </h2>
          <p className="text-lg text-muted-foreground">
            Our eco-friendly bags are not just good for the environment, they're also cost-effective 
            and designed to meet all your packaging needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300"
            >
              <div className="w-14 h-14 gradient-hero rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
