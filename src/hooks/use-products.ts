import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductSizeRow = Database['public']['Tables']['product_sizes']['Row'];

export interface ProductSize {
  id?: string;
  size: string;
  micron: number;
  capacity: string;
  pcsPerKg: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Database['public']['Enums']['product_category'];
  image: string;
  pricePerKg: number;
  sizes: ProductSize[];
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transform database row to frontend format
const transformProduct = (product: ProductRow, sizes: ProductSizeRow[]): Product => ({
  id: product.id,
  name: product.name,
  description: product.description || '',
  category: product.category,
  image: product.image || '/placeholder.svg',
  pricePerKg: Number(product.price_per_kg),
  sizes: sizes.map(s => ({
    id: s.id,
    size: s.size,
    micron: s.micron,
    capacity: s.capacity,
    pcsPerKg: s.pcs_per_kg,
  })),
  features: product.features || [],
  isActive: product.is_active,
  createdAt: new Date(product.created_at),
  updatedAt: new Date(product.updated_at),
});

// Fetch all products with sizes
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const { data: sizes, error: sizesError } = await supabase
        .from('product_sizes')
        .select('*');

      if (sizesError) throw sizesError;

      return (products || []).map(product => 
        transformProduct(product, (sizes || []).filter(s => s.product_id === product.id))
      );
    },
  });
};

// Fetch active products only
export const useActiveProducts = () => {
  return useQuery({
    queryKey: ['products', 'active'],
    queryFn: async (): Promise<Product[]> => {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const { data: sizes, error: sizesError } = await supabase
        .from('product_sizes')
        .select('*');

      if (sizesError) throw sizesError;

      return (products || []).map(product => 
        transformProduct(product, (sizes || []).filter(s => s.product_id === product.id))
      );
    },
  });
};

// Add product mutation
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          category: product.category,
          image: product.image,
          price_per_kg: product.pricePerKg,
          features: product.features,
          is_active: product.isActive,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Insert sizes
      if (product.sizes.length > 0) {
        const { error: sizesError } = await supabase
          .from('product_sizes')
          .insert(
            product.sizes.map(size => ({
              product_id: newProduct.id,
              size: size.size,
              micron: size.micron,
              capacity: size.capacity,
              pcs_per_kg: size.pcsPerKg,
            }))
          );

        if (sizesError) throw sizesError;
      }

      return newProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          image: updates.image,
          price_per_kg: updates.pricePerKg,
          features: updates.features,
          is_active: updates.isActive,
        })
        .eq('id', id);

      if (productError) throw productError;

      // Delete existing sizes and re-insert
      if (updates.sizes) {
        await supabase.from('product_sizes').delete().eq('product_id', id);

        if (updates.sizes.length > 0) {
          const { error: sizesError } = await supabase
            .from('product_sizes')
            .insert(
              updates.sizes.map(size => ({
                product_id: id,
                size: size.size,
                micron: size.micron,
                capacity: size.capacity,
                pcs_per_kg: size.pcsPerKg,
              }))
            );

          if (sizesError) throw sizesError;
        }
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete sizes first (cascade should handle this but being explicit)
      await supabase.from('product_sizes').delete().eq('product_id', id);

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Toggle product status mutation
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      return { id, isActive: !isActive };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
