import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient, ObjectId } from "npm:mongodb@6.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  pricePerKg: number;
}

interface Order {
  _id?: ObjectId;
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
  createdAt: string;
  notes?: string;
}

let client: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    const uri = Deno.env.get('MONGODB_URI');
    if (!uri) {
      throw new Error('MONGODB_URI not configured');
    }
    
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const mongoClient = await getMongoClient();
    const db = mongoClient.db('biobag');
    const orders = db.collection<Order>('orders');
    
    const url = new URL(req.url);
    const method = req.method;
    
    let result;
    
    if (method === 'GET') {
      const id = url.searchParams.get('id');
      
      if (id) {
        const doc = await orders.findOne({ _id: new ObjectId(id) });
        result = doc;
      } else {
        const docs = await orders.find({}).sort({ createdAt: -1 }).toArray();
        result = docs;
      }
      
    } else if (method === 'POST') {
      const body = await req.json();
      
      // Get count for order ID
      const count = await orders.countDocuments({});
      const orderId = `ORD-${String(count + 1).padStart(3, '0')}`;
      
      const newOrder = {
        ...body,
        orderId,
        status: body.status || 'pending',
        createdAt: new Date().toISOString(),
      };
      
      const insertResult = await orders.insertOne(newOrder);
      result = { ...newOrder, _id: insertResult.insertedId.toString() };
      
    } else if (method === 'PUT') {
      const body = await req.json();
      const { id, ...updates } = body;
      
      const updateResult = await orders.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
      result = { modifiedCount: updateResult.modifiedCount };
      
    } else if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Order ID required for deletion');
      }
      
      const deleteResult = await orders.deleteOne({ _id: new ObjectId(id) });
      result = { deleted: deleteResult.deletedCount > 0 };
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (err: unknown) {
    console.error('MongoDB Orders Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
