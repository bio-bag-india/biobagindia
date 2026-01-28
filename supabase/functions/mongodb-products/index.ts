import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductSize {
  size: string;
  micron: number;
  capacity: string;
  pcsPerKg: number;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  image: string;
  pricePerKg: number;
  sizes: ProductSize[];
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Data API helper
async function mongoDataAPI(action: string, body: Record<string, unknown>) {
  const uri = Deno.env.get('MONGODB_URI');
  if (!uri) {
    throw new Error('MONGODB_URI not configured');
  }
  
  // Parse the connection string to extract Data API credentials
  // Expected format for Data API: https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1
  // Or extract app-id and api-key from URI
  
  // For MongoDB Atlas Data API, we need: endpoint URL and API key
  // The MONGODB_URI should be the Data API endpoint with API key
  
  const response = await fetch(`${uri}/action/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': Deno.env.get('MONGODB_API_KEY') || '',
    },
    body: JSON.stringify({
      dataSource: 'Cluster0',
      database: 'biobag',
      collection: 'products',
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
      const activeOnly = url.searchParams.get('activeOnly') === 'true';
      
      if (id) {
        const response = await mongoDataAPI('findOne', {
          filter: { _id: { $oid: id } },
        });
        result = response.document;
      } else {
        const filter = activeOnly ? { isActive: true } : {};
        const response = await mongoDataAPI('find', { filter });
        result = response.documents;
      }
      
    } else if (method === 'POST') {
      const body = await req.json();
      const newProduct = {
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await mongoDataAPI('insertOne', { document: newProduct });
      result = { ...newProduct, _id: response.insertedId };
      
    } else if (method === 'PUT') {
      const body = await req.json();
      const { id, ...updates } = body;
      
      const response = await mongoDataAPI('updateOne', {
        filter: { _id: { $oid: id } },
        update: { $set: { ...updates, updatedAt: new Date().toISOString() } },
      });
      result = response;
      
    } else if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Product ID required for deletion');
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
    console.error('MongoDB Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
