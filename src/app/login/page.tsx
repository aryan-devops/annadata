
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useUser } from '@/firebase/provider';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Preloader from '@/components/preloader';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/admin/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return <Preloader />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    if (values.username !== 'aryan.devops' || values.password !== 'Aryan@#2003') {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid username or password.',
        });
        return;
    }
    
    setIsLoading(true);
    const emailForFirebase = 'aryan.devops@annadata.ai'; // Use a valid email format for Firebase

    try {
      // First, try to sign in
      await signInWithEmailAndPassword(auth, emailForFirebase, values.password);
      toast({ title: 'Login Successful', description: 'Redirecting to dashboard...' });
      router.push('/admin/dashboard');
    } catch (error: any) {
        // If the user does not exist, create the account (one-time setup)
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                await createUserWithEmailAndPassword(auth, emailForFirebase, values.password);
                toast({ title: 'Admin Account Created', description: 'This is a one-time setup. Logging you in...' });
                // The onAuthStateChanged listener in the provider will handle the redirect
            } catch (createError: any) {
                 toast({
                    variant: 'destructive',
                    title: 'Admin Setup Failed',
                    description: createError.message || 'Could not create the admin account.',
                });
            }
        } else {
             // Handle other errors like wrong password
             toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Incorrect password or another error occurred.',
            });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Sprout className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Panel Login</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="aryan.devops" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
