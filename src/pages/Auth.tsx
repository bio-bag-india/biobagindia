 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/use-auth';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { toast } from '@/hooks/use-toast';
 import { Leaf, Lock, Mail, Phone, Loader2, ArrowLeft } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { z } from 'zod';
 
 const loginSchema = z.object({
   emailOrPhone: z.string().min(1, 'Email or phone is required'),
   password: z.string().min(6, 'Password must be at least 6 characters'),
 });
 
 const signupSchema = z.object({
   email: z.string().email('Invalid email address'),
   password: z.string().min(6, 'Password must be at least 6 characters'),
   confirmPassword: z.string().min(6, 'Please confirm your password'),
 }).refine((data) => data.password === data.confirmPassword, {
   message: "Passwords don't match",
   path: ["confirmPassword"],
 });
 
 const Auth = () => {
   const [mode, setMode] = useState<'login' | 'signup'>('login');
   const [emailOrPhone, setEmailOrPhone] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
   
   const { signIn, signUp, user, isAdmin, isLoading } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!isLoading && user && isAdmin) {
       navigate('/admin');
     }
   }, [user, isAdmin, isLoading, navigate]);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
     setIsSubmitting(true);
 
     try {
       if (mode === 'login') {
         const result = loginSchema.safeParse({ emailOrPhone, password });
         if (!result.success) {
           const fieldErrors: Record<string, string> = {};
           result.error.errors.forEach((err) => {
             if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
           });
           setErrors(fieldErrors);
           setIsSubmitting(false);
           return;
         }
 
         const { error } = await signIn(emailOrPhone, password);
         if (error) {
           toast({
             title: 'Login Failed',
             description: error.message,
             variant: 'destructive',
           });
         } else {
           toast({
             title: 'Welcome!',
             description: 'You have successfully logged in.',
           });
         }
       } else {
         const result = signupSchema.safeParse({ email, password, confirmPassword });
         if (!result.success) {
           const fieldErrors: Record<string, string> = {};
           result.error.errors.forEach((err) => {
             if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
           });
           setErrors(fieldErrors);
           setIsSubmitting(false);
           return;
         }
 
         const { error } = await signUp(email, password);
         if (error) {
           if (error.message.includes('already registered')) {
             toast({
               title: 'Account Exists',
               description: 'An account with this email already exists. Please login instead.',
               variant: 'destructive',
             });
           } else {
             toast({
               title: 'Sign Up Failed',
               description: error.message,
               variant: 'destructive',
             });
           }
         } else {
           toast({
             title: 'Account Created!',
             description: 'Please check your email to verify your account.',
           });
           setMode('login');
         }
       }
     } finally {
       setIsSubmitting(false);
     }
   };
 
   if (isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="w-8 h-8 animate-spin text-primary" />
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
       <div className="w-full max-w-md">
         <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
           {/* Header */}
           <div className="text-center mb-8">
             <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
               <Leaf className="w-8 h-8 text-primary-foreground" />
             </div>
             <h1 className="font-display text-2xl font-bold text-foreground">
               Admin {mode === 'login' ? 'Login' : 'Sign Up'}
             </h1>
             <p className="text-muted-foreground mt-2">
               {mode === 'login' 
                 ? 'Sign in to access the admin panel' 
                 : 'Create an admin account'}
             </p>
           </div>
 
           <form onSubmit={handleSubmit} className="space-y-4">
             {mode === 'login' ? (
               <div className="space-y-2">
                 <Label htmlFor="emailOrPhone">Email or Phone</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="emailOrPhone"
                     type="text"
                     placeholder="email@example.com or +919876543210"
                     value={emailOrPhone}
                     onChange={(e) => setEmailOrPhone(e.target.value)}
                     className="pl-10"
                   />
                 </div>
                 {errors.emailOrPhone && (
                   <p className="text-sm text-destructive">{errors.emailOrPhone}</p>
                 )}
               </div>
             ) : (
               <div className="space-y-2">
                 <Label htmlFor="email">Email</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="email"
                     type="email"
                     placeholder="email@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="pl-10"
                   />
                 </div>
                 {errors.email && (
                   <p className="text-sm text-destructive">{errors.email}</p>
                 )}
               </div>
             )}
 
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input
                   id="password"
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="pl-10"
                 />
               </div>
               {errors.password && (
                 <p className="text-sm text-destructive">{errors.password}</p>
               )}
             </div>
 
             {mode === 'signup' && (
               <div className="space-y-2">
                 <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="confirmPassword"
                     type="password"
                     placeholder="••••••••"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="pl-10"
                   />
                 </div>
                 {errors.confirmPassword && (
                   <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                 )}
               </div>
             )}
 
             <Button
               type="submit"
               variant="hero"
               className="w-full"
               disabled={isSubmitting}
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin" />
                   {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                 </>
               ) : (
                 mode === 'login' ? 'Sign In' : 'Create Account'
               )}
             </Button>
           </form>
 
           <div className="mt-6 text-center">
             <p className="text-sm text-muted-foreground">
               {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
               <button
                 type="button"
                 onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                 className="text-primary hover:underline font-medium"
               >
                 {mode === 'login' ? 'Sign up' : 'Sign in'}
               </button>
             </p>
           </div>
 
           <div className="mt-4 text-center">
             <Link 
               to="/" 
               className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
             >
               <ArrowLeft className="w-4 h-4" />
               Back to Home
             </Link>
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default Auth;