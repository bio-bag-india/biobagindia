 import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
 import { User, Session } from '@supabase/supabase-js';
 import { supabase } from '@/integrations/supabase/client';
 
 interface AuthContextType {
   user: User | null;
   session: Session | null;
   isAdmin: boolean;
   isLoading: boolean;
   signIn: (emailOrPhone: string, password: string) => Promise<{ error: Error | null }>;
   signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
   signOut: () => Promise<void>;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [isAdmin, setIsAdmin] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
 
   const checkAdminRole = async (userId: string) => {
     const { data, error } = await supabase
       .from('user_roles')
       .select('role')
       .eq('user_id', userId)
       .eq('role', 'admin')
       .maybeSingle();
     
     if (!error && data) {
       setIsAdmin(true);
     } else {
       setIsAdmin(false);
     }
   };
 
   useEffect(() => {
     // Set up auth state listener FIRST
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
         setIsLoading(false);
 
         // Defer Supabase calls with setTimeout
         if (session?.user) {
           setTimeout(() => {
             checkAdminRole(session.user.id);
           }, 0);
         } else {
           setIsAdmin(false);
         }
       }
     );
 
     // THEN check for existing session
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       setIsLoading(false);
 
       if (session?.user) {
         checkAdminRole(session.user.id);
       }
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const signIn = async (emailOrPhone: string, password: string) => {
     // Determine if input is email or phone
     const isEmail = emailOrPhone.includes('@');
     
     let error;
     if (isEmail) {
       const result = await supabase.auth.signInWithPassword({
         email: emailOrPhone,
         password,
       });
       error = result.error;
     } else {
       const result = await supabase.auth.signInWithPassword({
         phone: emailOrPhone,
         password,
       });
       error = result.error;
     }
 
     return { error: error ? new Error(error.message) : null };
   };
 
   const signUp = async (email: string, password: string) => {
     const redirectUrl = `${window.location.origin}/`;
     
     const { error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         emailRedirectTo: redirectUrl,
       },
     });
 
     return { error: error ? new Error(error.message) : null };
   };
 
   const signOut = async () => {
     await supabase.auth.signOut();
     setUser(null);
     setSession(null);
     setIsAdmin(false);
   };
 
   return (
     <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signUp, signOut }}>
       {children}
     </AuthContext.Provider>
   );
 };
 
 export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
     throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
 };