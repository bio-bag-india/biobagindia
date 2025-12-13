// Simple in-memory order store (will be replaced with database later)
export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  pricePerKg: number;
}

export interface Order {
  id: string;
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
  createdAt: Date;
  notes?: string;
}

// In-memory storage (simulating a database)
let orders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    address: '123 Green Street, Sector 5',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    items: [
      { productId: 'carry-1', productName: 'Compostable Carry Bag', size: '16 X 20', quantity: 100, pricePerKg: 180 },
      { productId: 'garbage-1', productName: 'Garbage Bag', size: '19 X 21', quantity: 50, pricePerKg: 160 },
    ],
    totalAmount: 26000,
    status: 'pending',
    createdAt: new Date('2024-12-10'),
    notes: 'Urgent delivery required'
  },
  {
    id: 'ORD-002',
    customerName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    address: '456 Eco Lane, Block B',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    items: [
      { productId: 'grocery-1', productName: 'Grocery Bag', size: '10 X 15', quantity: 200, pricePerKg: 150 },
    ],
    totalAmount: 30000,
    status: 'confirmed',
    createdAt: new Date('2024-12-12'),
  },
  {
    id: 'ORD-003',
    customerName: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+91 76543 21098',
    address: '789 Nature Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    items: [
      { productId: 'courier-1', productName: 'Courier Bag', size: 'Custom', quantity: 500, pricePerKg: 200 },
    ],
    totalAmount: 100000,
    status: 'processing',
    createdAt: new Date('2024-12-08'),
  },
];

export const getOrders = (): Order[] => {
  return [...orders];
};

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

export const addOrder = (order: Omit<Order, 'id' | 'createdAt'>): Order => {
  const newOrder: Order = {
    ...order,
    id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
    createdAt: new Date(),
  };
  orders.push(newOrder);
  return newOrder;
};

export const updateOrderStatus = (id: string, status: Order['status']): Order | undefined => {
  const orderIndex = orders.findIndex(order => order.id === id);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    return orders[orderIndex];
  }
  return undefined;
};

export const deleteOrder = (id: string): boolean => {
  const initialLength = orders.length;
  orders = orders.filter(order => order.id !== id);
  return orders.length < initialLength;
};
