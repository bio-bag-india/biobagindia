export interface ProductSize {
  size: string;
  micron: number;
  capacity: string;
  pcsPerKg: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'carry' | 'garbage' | 'grocery' | 'courier' | 'nursery' | 'medical' | 'agriculture';
  image: string;
  pricePerKg: number;
  sizes: ProductSize[];
  features: string[];
}

export const products: Product[] = [
  {
    id: 'custom-bags',
    name: 'Custom Bags',
    description: '100% biodegradable carry bags made from corn starch. Perfect for retail stores, supermarkets, and daily shopping needs.',
    category: 'carry',
    image: '/placeholder.svg',
    pricePerKg: 0,
    sizes: [],
    features: ['CPCB Certified', '180 Days Decomposition', 'Custom Printing Available', 'Food Safe'],
  },
  {
    id: 'carry-bags',
    name: 'Compostable Carry Bags',
    description: '100% biodegradable carry bags made from corn starch. Perfect for retail stores, supermarkets, and daily shopping needs.',
    category: 'carry',
    image: '/placeholder.svg',
    pricePerKg: 180,
    sizes: [
      { size: '10 X 12', micron: 25, capacity: '1 KG', pcsPerKg: 178 },
      { size: '13 X 16', micron: 30, capacity: '3 KG', pcsPerKg: 97 },
      { size: '16 X 20', micron: 30, capacity: '5 KG', pcsPerKg: 60 },
      { size: '17 X 23', micron: 40, capacity: '7 KG', pcsPerKg: 45 },
      { size: '20 X 26', micron: 40, capacity: '10 KG', pcsPerKg: 33 },
      { size: '27 X 30', micron: 40, capacity: '15 KG', pcsPerKg: 18 },
    ],
    features: ['CPCB Certified', '180 Days Decomposition', 'Custom Printing Available', 'Food Safe'],
  },
  {
    id: 'garbage-bags',
    name: 'Compostable Garbage Bags',
    description: 'Eco-friendly garbage bags that decompose naturally. Ideal for households, offices, and municipal waste management.',
    category: 'garbage',
    image: '/placeholder.svg',
    pricePerKg: 160,
    sizes: [
      { size: '17 X 19', micron: 25, capacity: '1 KG', pcsPerKg: 75 },
      { size: '19 X 21', micron: 25, capacity: '3 KG', pcsPerKg: 60 },
      { size: '20 X 26', micron: 30, capacity: '5 KG', pcsPerKg: 38 },
      { size: '26 X 30', micron: 40, capacity: '7 KG', pcsPerKg: 19 },
      { size: '30 X 40', micron: 50, capacity: '10 KG', pcsPerKg: 10 },
    ],
    features: ['CPCB Certified', 'Leak Proof', 'Strong & Durable', 'Odor Control'],
  },
  {
    id: 'grocery-bags',
    name: 'Grocery Bags',
    description: 'Perfect for vegetable vendors, grocery stores, and daily food shopping. Made from plant-based materials.',
    category: 'grocery',
    image: '/placeholder.svg',
    pricePerKg: 150,
    sizes: [
      { size: '7 X 10', micron: 25, capacity: '1/2 KG', pcsPerKg: 280 },
      { size: '8 X 12', micron: 30, capacity: '1 KG', pcsPerKg: 205 },
      { size: '9 X 13', micron: 30, capacity: '2 KG', pcsPerKg: 145 },
      { size: '10 X 15', micron: 40, capacity: '3 KG', pcsPerKg: 100 },
      { size: '13 X 20', micron: 40, capacity: '5 KG', pcsPerKg: 57 },
      { size: '16 X 24', micron: 40, capacity: '10 KG', pcsPerKg: 40 },
    ],
    features: ['CPCB Certified', 'Food Grade', 'Water Resistant', 'Custom Sizes'],
  },
  {
    id: 'nursery-bags',
    name: 'Nursery Bags',
    description: 'Biodegradable bags for plant nurseries. Can be planted directly into soil - no transplant shock.',
    category: 'nursery',
    image: '/placeholder.svg',
    pricePerKg: 170,
    sizes: [
      { size: '4 X 6', micron: 30, capacity: 'Small Plants', pcsPerKg: 300 },
      { size: '6 X 8', micron: 40, capacity: 'Medium Plants', pcsPerKg: 180 },
      { size: '8 X 10', micron: 50, capacity: 'Large Plants', pcsPerKg: 120 },
    ],
    features: ['CPCB Certified', 'Plant Directly', 'Root Friendly', 'UV Stabilized'],
  },
  {
    id: 'medical-bags',
    name: 'Bio Medical Bags',
    description: 'Color-coded biomedical waste bags as per CPCB guidelines. Safe disposal of medical waste.',
    category: 'medical',
    image: '/placeholder.svg',
    pricePerKg: 220,
    sizes: [
      { size: '12 X 16', micron: 50, capacity: '5 KG', pcsPerKg: 50 },
      { size: '16 X 20', micron: 60, capacity: '10 KG', pcsPerKg: 30 },
      { size: '20 X 26', micron: 70, capacity: '15 KG', pcsPerKg: 20 },
    ],
    features: ['CPCB Certified', 'Color Coded', 'Biohazard Symbol', 'Hospital Grade'],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(product => product.category === category);
};
