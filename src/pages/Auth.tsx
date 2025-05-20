
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { signUp, signIn } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';

// Define form schemas with simplified requirements
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const registerFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Auth = () => {
  console.log("[Auth] Component rendering");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  // Create profile after registration
  const createProfile = async (userId: string, firstName: string, lastName: string) => {
    try {
      console.log("[Auth] Creating profile for user:", userId);
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          name: `${firstName} ${lastName}`,
        });
      
      if (error) throw error;
      console.log("[Auth] Profile created successfully");
      return true;
    } catch (error) {
      console.error('[Auth] Error creating profile:', error);
      return false;
    }
  };

  // Handle login
  const onLoginSubmit = async (values: LoginFormValues) => {
    console.log("[Auth] Login submission started with email:", values.email);
    setIsLoading(true);
    try {
      const { email, password } = values;
      const userData = await signIn({ email, password });
      console.log("[Auth] Login successful for:", email, userData);
      
      toast("Login successful");
      
      // Check if user has a role, if not redirect to role selection
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userData.user.id)
        .single();
      
      if (!profile?.role) {
        navigate('/role-selection');
      } else if (profile.role === 'alumni') {
        navigate('/mentor-dashboard');
      } else if (profile.role === 'applicant') {
        navigate('/applicant-dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      toast("Login failed: " + (error.message || "Failed to login. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    console.log("[Auth] Registration started:", values);
    setIsLoading(true);
    try {
      const { email, password, firstName, lastName } = values;
      
      const userData = await signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        metadata: {
          first_name: firstName,
          last_name: lastName,
        }
      });

      console.log("[Auth] Registration successful, user data:", userData);
      
      // Create profile for the new user
      if (userData.user) {
        await createProfile(userData.user.id, firstName, lastName);
      }
      
      // Sign in the user after registration
      console.log("[Auth] Signing in after registration");
      await signIn({ email, password });
      console.log("[Auth] Sign-in after registration completed");
      
      toast("Registration successful");
      navigate('/role-selection'); // Redirect to role selection
    } catch (error: any) {
      console.error('[Auth] Registration error:', error);
      toast("Registration failed: " + (error.message || "Failed to create account"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    {...loginForm.register('email')} 
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    {...loginForm.register('password')} 
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Sign in'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      {...registerForm.register('firstName')} 
                    />
                    {registerForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm">{registerForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      {...registerForm.register('lastName')} 
                    />
                    {registerForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm">{registerForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input 
                    id="reg-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    {...registerForm.register('email')} 
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    placeholder="••••••••" 
                    {...registerForm.register('password')} 
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
