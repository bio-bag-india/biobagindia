import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient, ObjectId } from "npm:mongodb@6.3.0";

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
  _id?: ObjectId;
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
    const products = db.collection<Product>('products');
    
    const url = new URL(req.url);
    const method = req.method;
    
    let result;
    
    if (method === 'GET') {
      const id = url.searchParams.get('id');
      const activeOnly = url.searchParams.get('activeOnly') === 'true';
      
      if (id) {
        const doc = await products.findOne({ _id: new ObjectId(id) });
        result = doc;
      } else {
        const filter = activeOnly ? { isActive: true } : {};
        const docs = await products.find(filter).toArray();
        result = docs;
      }
      
    } else if (method === 'POST') {
      const body = await req.json();
      const newProduct = {
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const insertResult = await products.insertOne(newProduct);
      result = { ...newProduct, _id: insertResult.insertedId.toString() };
      
    } else if (method === 'PUT') {
      const body = await req.json();
      const { id, ...updates } = body;
      
      const updateResult = await products.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      result = { modifiedCount: updateResult.modifiedCount };
      
    } else if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Product ID required for deletion');
      }
      
      const deleteResult = await products.deleteOne({ _id: new ObjectId(id) });
      result = { deleted: deleteResult.deletedCount > 0 };
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
