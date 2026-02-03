import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type OrderStatus = Database['public']['Enums']['order_status'];

export interface OrderItem {
  productId: string | null;
  productName: string;
  size: string;
  quantity: number;
  pricePerKg: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  notes?: string;
}

// Transform database row to frontend format
const transformOrder = (order: OrderRow, items: OrderItemRow[]): Order => ({
  id: order.id,
  orderNumber: order.order_number,
  customerName: order.customer_name,
  email: order.email,
  phone: order.phone,
  address: order.address,
  city: order.city,
  state: order.state,
  pincode: order.pincode,
  items: items.map(item => ({
    productId: item.product_id,
    productName: item.product_name,
    size: item.size,
    quantity: item.quantity,
    pricePerKg: Number(item.price_per_kg),
  })),
  totalAmount: Number(order.total_amount),
  status: order.status,
  createdAt: new Date(order.created_at),
  notes: order.notes || undefined,
});

// Fetch all orders
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*');

      if (itemsError) throw itemsError;

      return (orders || []).map(order => 
        transformOrder(order, (items || []).filter(i => i.order_id === order.id))
      );
    },
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: {
      customerName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      items: OrderItem[];
      totalAmount: number;
      notes?: string;
    }) => {
      // Generate order number (will be overwritten by trigger)
      const orderNumber = `ORD-${Date.now()}`;

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: order.customerName,
          email: order.email,
          phone: order.phone,
          address: order.address,
          city: order.city,
          state: order.state,
          pincode: order.pincode,
          total_amount: order.totalAmount,
          notes: order.notes,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      if (order.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            order.items.map(item => ({
              order_id: newOrder.id,
              product_id: item.productId,
              product_name: item.productName,
              size: item.size,
              quantity: item.quantity,
              price_per_kg: item.pricePerKg,
            }))
          );

        if (itemsError) throw itemsError;
      }

      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Update order status mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Delete order mutation
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete order items first
      await supabase.from('order_items').delete().eq('order_id', id);

      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
