import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type ProductCategory = 'carry' | 'garbage' | 'grocery' | 'courier' | 'nursery' | 'medical' | 'agriculture' | 'custom';

export interface ProductSize {
  id?: string;
  product_id?: string;
  size: string;
  micron: number;
  capacity: string;
  pcs_per_kg: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  image: string | null;
  price_per_kg: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sizes?: ProductSize[];
}

export interface ProductFormData {
  name: string;
  description: string;
  category: ProductCategory;
  image: string;
  price_per_kg: number;
  features: string[];
  is_active: boolean;
  sizes: Omit<ProductSize, 'id' | 'product_id'>[];
}

// Fetch all products with their sizes
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

      // Map sizes to products
      return (products || []).map(product => ({
        ...product,
        sizes: (sizes || []).filter(s => s.product_id === product.id),
      }));
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

      return (products || []).map(product => ({
        ...product,
        sizes: (sizes || []).filter(s => s.product_id === product.id),
      }));
    },
  });
};

// Add a new product
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: data.name,
          description: data.description || null,
          category: data.category,
          image: data.image || '/placeholder.svg',
          price_per_kg: data.price_per_kg,
          features: data.features,
          is_active: data.is_active,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Insert sizes if any
      if (data.sizes.length > 0) {
        const { error: sizesError } = await supabase
          .from('product_sizes')
          .insert(
            data.sizes.map(size => ({
              product_id: product.id,
              size: size.size,
              micron: size.micron,
              capacity: size.capacity,
              pcs_per_kg: size.pcs_per_kg,
            }))
          );

        if (sizesError) throw sizesError;
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product Added', description: 'Product has been added successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      // Update product
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: data.name,
          description: data.description || null,
          category: data.category,
          image: data.image || '/placeholder.svg',
          price_per_kg: data.price_per_kg,
          features: data.features,
          is_active: data.is_active,
        })
        .eq('id', id);

      if (productError) throw productError;

      // Delete existing sizes and insert new ones
      const { error: deleteError } = await supabase
        .from('product_sizes')
        .delete()
        .eq('product_id', id);

      if (deleteError) throw deleteError;

      if (data.sizes.length > 0) {
        const { error: sizesError } = await supabase
          .from('product_sizes')
          .insert(
            data.sizes.map(size => ({
              product_id: id,
              size: size.size,
              micron: size.micron,
              capacity: size.capacity,
              pcs_per_kg: size.pcs_per_kg,
            }))
          );

        if (sizesError) throw sizesError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product Updated', description: 'Product has been updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product Deleted', description: 'Product has been deleted successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Toggle product status
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !isActive })
        .eq('id', id);
      if (error) throw error;
      return !isActive;
    },
    onSuccess: (newStatus) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: newStatus ? 'Product Activated' : 'Product Deactivated',
        description: `Product is now ${newStatus ? 'visible' : 'hidden'} on the products page.`,
      });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
