import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  createdAt: string;
  notes?: string;
}

// MongoDB Data API helper
async function mongoDataAPI(action: string, body: Record<string, unknown>) {
  const uri = Deno.env.get('MONGODB_URI');
  if (!uri) {
    throw new Error('MONGODB_URI not configured');
  }
  
  const response = await fetch(`${uri}/action/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': Deno.env.get('MONGODB_API_KEY') || '',
    },
    body: JSON.stringify({
      dataSource: 'Cluster0',
      database: 'biobag',
      collection: 'orders',
      ...body,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MongoDB API error: ${errorText}`);
  }
  
  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const method = req.method;
    
    let result;
    
    if (method === 'GET') {
      const id = url.searchParams.get('id');
      
      if (id) {
        const response = await mongoDataAPI('findOne', {
          filter: { _id: { $oid: id } },
        });
        result = response.document;
      } else {
        const response = await mongoDataAPI('find', {
          filter: {},
          sort: { createdAt: -1 },
        });
        result = response.documents;
      }
      
    } else if (method === 'POST') {
      const body = await req.json();
      
      // Get count for order ID
      const countResponse = await mongoDataAPI('aggregate', {
        pipeline: [{ $count: 'total' }],
      });
      const count = countResponse.documents?.[0]?.total || 0;
      const orderId = `ORD-${String(count + 1).padStart(3, '0')}`;
      
      const newOrder = {
        ...body,
        orderId,
        status: body.status || 'pending',
        createdAt: new Date().toISOString(),
      };
      
      const response = await mongoDataAPI('insertOne', { document: newOrder });
      result = { ...newOrder, _id: response.insertedId };
      
    } else if (method === 'PUT') {
      const body = await req.json();
      const { id, ...updates } = body;
      
      const response = await mongoDataAPI('updateOne', {
        filter: { _id: { $oid: id } },
        update: { $set: updates },
      });
      result = response;
      
    } else if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Order ID required for deletion');
      }
      
      const response = await mongoDataAPI('deleteOne', {
        filter: { _id: { $oid: id } },
      });
      result = { deleted: response.deletedCount > 0 };
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
