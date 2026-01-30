import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders, useUpdateOrderStatus, useDeleteOrder, Order, OrderStatus } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductManagement from '@/components/admin/ProductManagement';
import { 
  LayoutDashboard, 
  Package, 
  Leaf, 
  Search, 
  Eye,
  Trash2,
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  PackageCheck,
  ShoppingBag,
  Loader2
} from 'lucide-react';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
};

const Admin = () => {
  const { data: orders = [], isLoading: isLoadingOrders } = useOrders();
  const { data: products = [] } = useProducts();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus.mutate({ id: orderId, status: newStatus });
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      deleteOrder.mutate(orderId);
      setSelectedOrder(null);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== 'cancelled') {
      return sum + order.total_amount;
    }
    return sum;
  }, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar p-6 border-r border-sidebar-border hidden lg:block">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 gradient-hero rounded-full flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">Bio Bag India</h1>
            <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent'}`}
          >
            <Package className="w-5 h-5" />
            <span>Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Products</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
              <ArrowLeft className="w-4 h-4" />
              Back to Website
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-hero rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">Admin Panel</h1>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats - Show on Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-card p-6 rounded-xl border border-border shadow-soft">
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-foreground">{orders.length}</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-soft">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-soft">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-primary">{completedOrders}</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-soft">
              <p className="text-sm text-muted-foreground mb-1">Products</p>
              <p className="text-3xl font-bold text-foreground">{products.length}</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-soft">
              <p className="text-sm text-muted-foreground mb-1">Revenue</p>
              <p className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <ProductManagement />
        )}

        {/* Orders Section - Show on Dashboard and Orders tab */}
        {(activeTab === 'dashboard' || activeTab === 'orders') && (
        <div className="bg-card rounded-xl border border-border shadow-soft">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Orders</h2>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            {isLoadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status];
                    return (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-medium text-foreground">{order.order_number}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <span className="text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-foreground">
                            ₹{order.total_amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                            <StatusIcon className="w-3 h-3" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {!isLoadingOrders && filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </div>
        </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">
                Order Details - {selectedOrder.order_number}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium text-foreground">Order Status</span>
                <Select 
                  value={selectedOrder.status} 
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value as OrderStatus)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{selectedOrder.email}</span>
                  </div>
                  <div className="col-span-2 flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span className="text-sm">
                      {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Order Items</h4>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{item.quantity} kg</p>
                        <p className="text-sm text-muted-foreground">₹{item.price_per_kg}/kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Notes</h4>
                  <p className="text-muted-foreground text-sm p-3 bg-muted rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <span className="font-semibold text-foreground">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  ₹{selectedOrder.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
