import { supabase } from "@/integrations/supabase/client";

// Product types
export interface ProductSize {
  size: string;
  micron: number;
  capacity: string;
  pcsPerKg: number;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: 'carry' | 'garbage' | 'grocery' | 'courier' | 'nursery' | 'medical' | 'agriculture' | 'custom';
  image: string;
  pricePerKg: number;
  sizes: ProductSize[];
  features: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order types
export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  pricePerKg: number;
}

export interface Order {
  _id?: string;
  orderId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
  notes?: string;
}

// ============ PRODUCTS API ============

export const fetchProducts = async (activeOnly = false): Promise<Product[]> => {
  const { data, error } = await supabase.functions.invoke('mongodb-products', {
    method: 'GET',
    body: null,
  });
  
  // For GET requests, we need to use query params approach
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-products?activeOnly=${activeOnly}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch products');
  }
  
  return response.json();
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-products?id=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch product');
  }
  
  return response.json();
};

export const createProduct = async (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const { data, error } = await supabase.functions.invoke('mongodb-products', {
    method: 'POST',
    body: product,
  });
  
  if (error) throw new Error(error.message);
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase.functions.invoke('mongodb-products', {
    method: 'PUT',
    body: { id, ...updates },
  });
  
  if (error) throw new Error(error.message);
  return data;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-products?id=${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete product');
  }
  
  const result = await response.json();
  return result.deleted;
};

// ============ ORDERS API ============

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-orders`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch orders');
  }
  
  return response.json();
};

export const fetchOrderById = async (id: string): Promise<Order | null> => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-orders?id=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch order');
  }
  
  return response.json();
};

export const createOrder = async (order: Omit<Order, '_id' | 'orderId' | 'createdAt'>): Promise<Order> => {
  const { data, error } = await supabase.functions.invoke('mongodb-orders', {
    method: 'POST',
    body: order,
  });
  
  if (error) throw new Error(error.message);
  return data;
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order> => {
  const { data, error } = await supabase.functions.invoke('mongodb-orders', {
    method: 'PUT',
    body: { id, status },
  });
  
  if (error) throw new Error(error.message);
  return data;
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-orders?id=${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete order');
  }
  
  const result = await response.json();
  return result.deleted;
};
