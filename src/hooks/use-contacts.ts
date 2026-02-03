import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ContactRow = Database['public']['Tables']['contacts']['Row'];

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Transform database row to frontend format
const transformContact = (contact: ContactRow): Contact => ({
  id: contact.id,
  name: contact.name,
  email: contact.email,
  phone: contact.phone || undefined,
  company: contact.company || undefined,
  message: contact.message,
  isRead: contact.is_read,
  createdAt: new Date(contact.created_at),
});

// Fetch all contacts
export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<Contact[]> => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(transformContact);
    },
  });
};

// Submit contact form mutation
export const useSubmitContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
      message: string;
    }) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          company: contact.company,
          message: contact.message,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

// Mark contact as read mutation
export const useMarkContactRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

// Delete contact mutation
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
