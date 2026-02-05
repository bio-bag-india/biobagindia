 import { useState } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import Header from '@/components/Header';
 import Footer from '@/components/Footer';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { toast } from '@/hooks/use-toast';
 import { 
   Package, 
   Search, 
   Clock, 
   CheckCircle, 
   XCircle, 
   Truck, 
   PackageCheck,
   MapPin,
   Phone,
   Mail,
   Calendar,
   Loader2
 } from 'lucide-react';
 import { Database } from '@/integrations/supabase/types';
 
 type OrderStatus = Database['public']['Enums']['order_status'];
 
 interface OrderItem {
   productName: string;
   size: string;
   quantity: number;
   pricePerKg: number;
 }
 
 interface TrackedOrder {
   orderNumber: string;
   customerName: string;
   email: string;
   phone: string;
   address: string;
   city: string;
   state: string;
   pincode: string;
   status: OrderStatus;
   totalAmount: number;
   createdAt: Date;
   items: OrderItem[];
 }
 
 const statusColors: Record<OrderStatus, string> = {
   pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
   confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
   processing: 'bg-purple-100 text-purple-800 border-purple-300',
   shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
   delivered: 'bg-green-100 text-green-800 border-green-300',
   cancelled: 'bg-red-100 text-red-800 border-red-300',
 };
 
 const statusIcons: Record<OrderStatus, typeof Clock> = {
   pending: Clock,
   confirmed: CheckCircle,
   processing: Package,
   shipped: Truck,
   delivered: PackageCheck,
   cancelled: XCircle,
 };
 
 const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
 
 const TrackOrder = () => {
   const [orderNumber, setOrderNumber] = useState('');
   const [isSearching, setIsSearching] = useState(false);
   const [order, setOrder] = useState<TrackedOrder | null>(null);
   const [notFound, setNotFound] = useState(false);
 
   const handleSearch = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!orderNumber.trim()) {
       toast({
         title: 'Enter Order Number',
         description: 'Please enter your order number to track.',
         variant: 'destructive',
       });
       return;
     }
 
     setIsSearching(true);
     setNotFound(false);
     setOrder(null);
 
     try {
       const { data: orderData, error: orderError } = await supabase
         .from('orders')
         .select('*')
         .eq('order_number', orderNumber.trim().toUpperCase())
         .maybeSingle();
 
       if (orderError) throw orderError;
 
       if (!orderData) {
         setNotFound(true);
         return;
       }
 
       const { data: itemsData } = await supabase
         .from('order_items')
         .select('*')
         .eq('order_id', orderData.id);
 
       setOrder({
         orderNumber: orderData.order_number,
         customerName: orderData.customer_name,
         email: orderData.email,
         phone: orderData.phone,
         address: orderData.address,
         city: orderData.city,
         state: orderData.state,
         pincode: orderData.pincode,
         status: orderData.status,
         totalAmount: Number(orderData.total_amount),
         createdAt: new Date(orderData.created_at),
         items: (itemsData || []).map(item => ({
           productName: item.product_name,
           size: item.size,
           quantity: item.quantity,
           pricePerKg: Number(item.price_per_kg),
         })),
       });
     } catch (error) {
       toast({
         title: 'Error',
         description: 'Failed to fetch order details. Please try again.',
         variant: 'destructive',
       });
     } finally {
       setIsSearching(false);
     }
   };
 
   const getStatusIndex = (status: OrderStatus) => {
     if (status === 'cancelled') return -1;
     return statusSteps.indexOf(status);
   };
 
   return (
     <div className="min-h-screen bg-background">
       <Header />
       
       <main className="container mx-auto px-4 py-12">
         {/* Header */}
         <div className="text-center max-w-2xl mx-auto mb-12">
           <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
             <Package className="w-8 h-8 text-primary-foreground" />
           </div>
           <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
             Track Your Order
           </h1>
           <p className="text-muted-foreground">
             Enter your order number to see the current status and details of your order.
           </p>
         </div>
 
         {/* Search Form */}
         <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
           <div className="flex gap-3">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
               <Input
                 placeholder="Enter order number (e.g., ORD-000001)"
                 value={orderNumber}
                 onChange={(e) => setOrderNumber(e.target.value)}
                 className="pl-12 h-12 text-lg"
               />
             </div>
             <Button type="submit" variant="hero" size="lg" disabled={isSearching}>
               {isSearching ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                 'Track'
               )}
             </Button>
           </div>
         </form>
 
         {/* Not Found Message */}
         {notFound && (
           <div className="max-w-xl mx-auto text-center py-12 bg-card rounded-2xl border border-border">
             <XCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
             <h2 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h2>
             <p className="text-muted-foreground">
               We couldn't find an order with number "{orderNumber}". Please check and try again.
             </p>
           </div>
         )}
 
         {/* Order Details */}
         {order && (
           <div className="max-w-4xl mx-auto">
             {/* Status Card */}
             <div className="bg-card rounded-2xl border border-border shadow-soft p-6 md:p-8 mb-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <div>
                   <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                   <h2 className="text-2xl font-bold text-foreground">{order.orderNumber}</h2>
                 </div>
                 <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusColors[order.status]}`}>
                   {(() => {
                     const StatusIcon = statusIcons[order.status];
                     return <StatusIcon className="w-5 h-5" />;
                   })()}
                   <span className="font-semibold text-lg">
                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                   </span>
                 </div>
               </div>
 
               {/* Status Timeline */}
               {order.status !== 'cancelled' && (
                 <div className="relative">
                   <div className="flex justify-between mb-2">
                     {statusSteps.map((step, index) => {
                       const isActive = getStatusIndex(order.status) >= index;
                       const StepIcon = statusIcons[step];
                       return (
                         <div key={step} className="flex flex-col items-center flex-1">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                             isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                           }`}>
                             <StepIcon className="w-5 h-5" />
                           </div>
                           <span className={`text-xs text-center font-medium ${
                             isActive ? 'text-foreground' : 'text-muted-foreground'
                           }`}>
                             {step.charAt(0).toUpperCase() + step.slice(1)}
                           </span>
                         </div>
                       );
                     })}
                   </div>
                   {/* Progress Line */}
                   <div className="absolute top-5 left-[5%] right-[5%] h-1 bg-muted -z-10">
                     <div 
                       className="h-full bg-primary transition-all"
                       style={{ 
                         width: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%` 
                       }}
                     />
                   </div>
                 </div>
               )}
 
               {order.status === 'cancelled' && (
                 <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                   <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                   <p className="text-destructive font-medium">This order has been cancelled.</p>
                 </div>
               )}
             </div>
 
             {/* Order Info Grid */}
             <div className="grid md:grid-cols-2 gap-6 mb-6">
               {/* Customer Details */}
               <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
                 <h3 className="font-semibold text-foreground mb-4">Customer Details</h3>
                 <div className="space-y-3">
                   <div className="flex items-start gap-3">
                     <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                     <div>
                       <p className="text-sm text-muted-foreground">Email</p>
                       <p className="text-foreground">{order.email}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                     <div>
                       <p className="text-sm text-muted-foreground">Phone</p>
                       <p className="text-foreground">{order.phone}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                     <div>
                       <p className="text-sm text-muted-foreground">Order Date</p>
                       <p className="text-foreground">
                         {order.createdAt.toLocaleDateString('en-IN', {
                           day: 'numeric',
                           month: 'long',
                           year: 'numeric',
                         })}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
 
               {/* Shipping Address */}
               <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
                 <h3 className="font-semibold text-foreground mb-4">Shipping Address</h3>
                 <div className="flex items-start gap-3">
                   <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                   <div>
                     <p className="font-medium text-foreground">{order.customerName}</p>
                     <p className="text-muted-foreground">{order.address}</p>
                     <p className="text-muted-foreground">
                       {order.city}, {order.state} - {order.pincode}
                     </p>
                   </div>
                 </div>
               </div>
             </div>
 
             {/* Order Items */}
             <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
               <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
               <div className="space-y-4">
                 {order.items.map((item, index) => (
                   <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                         <Package className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                         <p className="font-medium text-foreground">{item.productName}</p>
                         <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="font-medium text-foreground">{item.quantity} kg</p>
                       <p className="text-sm text-muted-foreground">₹{item.pricePerKg}/kg</p>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                 <span className="text-lg font-semibold text-foreground">Total Amount</span>
                 <span className="text-2xl font-bold text-primary">₹{order.totalAmount.toLocaleString()}</span>
               </div>
             </div>
           </div>
         )}
       </main>
 
       <Footer />
     </div>
   );
 };
 
 export default TrackOrder;