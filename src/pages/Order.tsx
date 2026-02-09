import { useState } from 'react';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActiveProducts, Product } from '@/hooks/use-products';
import { useCreateOrder, OrderItem } from '@/hooks/use-orders';
import { toast } from '@/hooks/use-toast';
import { ShoppingBag, Plus, Trash2, Check, Loader2 } from 'lucide-react';

const orderItemSchema = z.object({
  productId: z.string().nullable(),
  productName: z.string().min(1).max(100),
  size: z.string().min(1).max(50),
  quantity: z.number().int().min(1, "Quantity must be at least 1 kg").max(100000, "Quantity too large"),
  pricePerKg: z.number().min(0),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email format").max(255),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number (10-15 digits)"),
  address: z.string().trim().min(10, "Address too short").max(500, "Address too long"),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  items: z.array(orderItemSchema).min(1, "Add at least one item"),
  notes: z.string().max(1000, "Notes too long").optional(),
});

const Order = () => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Current item being added
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [quantity, setQuantity] = useState('');

  const { data: products = [], isLoading: productsLoading } = useActiveProducts();
  const createOrder = useCreateOrder();

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const isCustomBag = selectedProductData?.category === 'custom';

  const addItem = () => {
    const sizeToUse = isCustomBag ? customSize : selectedSize;
    
    if (!selectedProduct || !sizeToUse || !quantity) {
      toast({
        title: 'Missing Information',
        description: isCustomBag 
          ? 'Please enter custom size and quantity.' 
          : 'Please select a product, size, and enter quantity.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedProductData) return;

    const newItem: OrderItem = {
      productId: selectedProductData.id,
      productName: selectedProductData.name,
      size: sizeToUse,
      quantity: parseInt(quantity),
      pricePerKg: selectedProductData.pricePerKg,
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct('');
    setSelectedSize('');
    setCustomSize('');
    setQuantity('');

    toast({
      title: 'Item Added',
      description: `${selectedProductData.name} (${sizeToUse}) added to your order.`,
    });
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.quantity * item.pricePerKg, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = orderSchema.parse({
        customerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        items: orderItems,
        notes: notes || undefined,
      });

      createOrder.mutate(
        {
          customerName: validatedData.customerName,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          city: validatedData.city,
          state: validatedData.state,
          pincode: validatedData.pincode,
          items: validatedData.items as OrderItem[],
          totalAmount: calculateTotal(),
          notes: validatedData.notes,
        },
        {
          onSuccess: (data) => {
            setOrderNumber(data.order_number);
            setOrderPlaced(true);
            toast({
              title: 'Order Placed Successfully!',
              description: `Your order ID is ${data.order_number}. We will contact you shortly.`,
            });
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: 'Failed to place order. Please try again.',
              variant: 'destructive',
            });
            console.error('Order error:', error);
          },
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Order Placed Successfully!
              </h1>
              <p className="text-muted-foreground mb-2">
                Your order number is: <strong className="text-primary">{orderNumber}</strong>
              </p>
              <p className="text-muted-foreground mb-8">
                Thank you for choosing Bio Bag India. We have received your order and will contact you 
                shortly to confirm the details.
              </p>
              <Button variant="hero" onClick={() => window.location.reload()}>
                Place Another Order
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-12 gradient-nature">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Place Order
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Order Your Eco-Friendly Bags
              </h1>
              <p className="text-lg text-muted-foreground">
                Fill in the details below and we'll get back to you with a quote.
              </p>
            </div>
          </div>
        </section>

        {/* Order Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Product Selection */}
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                        Select Products
                      </h2>

                      {/* Add Item Form */}
                      <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                        <div>
                          <Label htmlFor="product">Product</Label>
                          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedProductData && isCustomBag && (
                          <div>
                            <Label htmlFor="customSize">Size (in inches, e.g., 12 X 16)</Label>
                            <Input
                              id="customSize"
                              value={customSize}
                              onChange={(e) => setCustomSize(e.target.value)}
                              placeholder="Enter size like 12 X 16"
                              className="mt-1"
                              maxLength={50}
                            />
                          </div>
                        )}

                        {selectedProductData && !isCustomBag && selectedProductData.sizes.length > 0 && (
                          <div>
                            <Label htmlFor="size">Size</Label>
                            <Select value={selectedSize} onValueChange={setSelectedSize}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedProductData.sizes.map((size) => (
                                  <SelectItem key={size.size} value={size.size}>
                                    {size.size} ({size.capacity}) - {size.pcsPerKg} pcs/kg
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="quantity">Quantity (in kg)</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity in kg"
                            className="mt-1"
                          />
                        </div>

                        <Button type="button" onClick={addItem} variant="outline" className="w-full">
                          <Plus className="w-4 h-4" />
                          Add to Order
                        </Button>
                      </div>
                    </div>

                    {/* Order Items */}
                    {orderItems.length > 0 && (
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                          Order Items
                        </h3>
                        <div className="space-y-3">
                          {orderItems.map((item, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-4 bg-muted rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-foreground">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Size: {item.size} | Qty: {item.quantity} kg
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                      Customer Details
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Enter your full name"
                          className="mt-1"
                          maxLength={100}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="mt-1"
                          maxLength={255}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="mt-1"
                          maxLength={15}
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your complete address"
                          className="mt-1"
                          maxLength={500}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="mt-1"
                          maxLength={100}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State"
                          className="mt-1"
                          maxLength={100}
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="Pincode"
                          className="mt-1"
                          maxLength={6}
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any special requirements or custom printing needs..."
                          className="mt-1"
                          maxLength={1000}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="xl" 
                      className="w-full"
                      disabled={createOrder.isPending || orderItems.length === 0}
                    >
                      {createOrder.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          Place Order
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      By placing an order, you agree to our terms and conditions. 
                      We will contact you to confirm the order and provide final pricing.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Order;
