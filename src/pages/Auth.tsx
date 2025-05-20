
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define form schemas
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

// Student registration schema
const studentRegisterFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Applicant registration schema
const applicantRegisterFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
  schoolId: z.string().optional(),
  majorId: z.string().optional(),
  degree: z.string().optional(),
  sport: z.string().optional(),
  clubs: z.string().optional(),
  greekLife: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type StudentRegisterFormValues = z.infer<typeof studentRegisterFormSchema>;
type ApplicantRegisterFormValues = z.infer<typeof applicantRegisterFormSchema>;

const Auth = () => {
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
  
  // Student Register form
  const studentRegisterForm = useForm<StudentRegisterFormValues>({
    resolver: zodResolver(studentRegisterFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Applicant Register form
  const applicantRegisterForm = useForm<ApplicantRegisterFormValues>({
    resolver: zodResolver(applicantRegisterFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolId: '',
      majorId: '',
      degree: '',
      sport: '',
      clubs: '',
      greekLife: '',
    },
  });

  // Handle login
  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      await signIn({ email, password });
      toast.success("Login successful", {
        description: "Welcome back!"
      });
      navigate('/student-dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("Login failed", {
        description: error.message || "Failed to login. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student registration
  const onStudentRegisterSubmit = async (values: StudentRegisterFormValues) => {
    setIsLoading(true);
    try {
      const { email, password, firstName, lastName } = values;

      await signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        metadata: {
          user_type: 'student',
          role: 'student',
        }
      });

      toast.success("Registration successful", {
        description: "Your account has been created. Please check your email to verify your account."
      });

      await signIn({ email, password });
      navigate('/student-dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error("Registration failed", {
        description: error.message || "Failed to create account. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle applicant registration
  const onApplicantRegisterSubmit = async (values: ApplicantRegisterFormValues) => {
    setIsLoading(true);
    try {
      const { 
        email, 
        password, 
        firstName, 
        lastName,
        schoolId,
        majorId,
        degree,
        sport,
        clubs,
        greekLife
      } = values;

      await signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        metadata: {
          user_type: 'applicant',
          role: 'applicant',
          school_id: schoolId || null,
          major_id: majorId || null,
          degree: degree || null,
          sport: sport || null,
          clubs: clubs || null,
          greek_life: greekLife || null
        }
      });

      toast.success("Registration successful", {
        description: "Your account has been created. Please check your email to verify your account."
      });

      await signIn({ email, password });
      navigate('/profile-complete');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error("Registration failed", {
        description: error.message || "Failed to create account. Please try again."
      });
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
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="student-register">Student Registration</TabsTrigger>
              <TabsTrigger value="applicant-register">Applicant Registration</TabsTrigger>
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
            
            <TabsContent value="student-register" className="space-y-4">
              <form onSubmit={studentRegisterForm.handleSubmit(onStudentRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-firstName">First Name</Label>
                    <Input 
                      id="student-firstName" 
                      placeholder="John" 
                      {...studentRegisterForm.register('firstName')} 
                    />
                    {studentRegisterForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm">{studentRegisterForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-lastName">Last Name</Label>
                    <Input 
                      id="student-lastName" 
                      placeholder="Doe" 
                      {...studentRegisterForm.register('lastName')} 
                    />
                    {studentRegisterForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm">{studentRegisterForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input 
                    id="student-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    {...studentRegisterForm.register('email')} 
                  />
                  {studentRegisterForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">{studentRegisterForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input 
                      id="student-password" 
                      type="password" 
                      placeholder="••••••••" 
                      {...studentRegisterForm.register('password')} 
                    />
                    {studentRegisterForm.formState.errors.password && (
                      <p className="text-red-500 text-sm">{studentRegisterForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-confirmPassword">Confirm Password</Label>
                    <Input 
                      id="student-confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      {...studentRegisterForm.register('confirmPassword')} 
                    />
                    {studentRegisterForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{studentRegisterForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Student Account'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="applicant-register" className="space-y-4">
              <form onSubmit={applicantRegisterForm.handleSubmit(onApplicantRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicant-firstName">First Name</Label>
                    <Input 
                      id="applicant-firstName" 
                      placeholder="John" 
                      {...applicantRegisterForm.register('firstName')} 
                    />
                    {applicantRegisterForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm">{applicantRegisterForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="applicant-lastName">Last Name</Label>
                    <Input 
                      id="applicant-lastName" 
                      placeholder="Doe" 
                      {...applicantRegisterForm.register('lastName')} 
                    />
                    {applicantRegisterForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm">{applicantRegisterForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="applicant-email">Email</Label>
                  <Input 
                    id="applicant-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    {...applicantRegisterForm.register('email')} 
                  />
                  {applicantRegisterForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">{applicantRegisterForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicant-password">Password</Label>
                    <Input 
                      id="applicant-password" 
                      type="password" 
                      placeholder="••••••••" 
                      {...applicantRegisterForm.register('password')} 
                    />
                    {applicantRegisterForm.formState.errors.password && (
                      <p className="text-red-500 text-sm">{applicantRegisterForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="applicant-confirmPassword">Confirm Password</Label>
                    <Input 
                      id="applicant-confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      {...applicantRegisterForm.register('confirmPassword')} 
                    />
                    {applicantRegisterForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{applicantRegisterForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Select onValueChange={(value) => applicantRegisterForm.setValue('schoolId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harvard">Harvard University</SelectItem>
                      <SelectItem value="stanford">Stanford University</SelectItem>
                      <SelectItem value="mit">MIT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Select onValueChange={(value) => applicantRegisterForm.setValue('majorId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="bio">Biology</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Select onValueChange={(value) => applicantRegisterForm.setValue('degree', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ba">Bachelor of Arts</SelectItem>
                      <SelectItem value="bs">Bachelor of Science</SelectItem>
                      <SelectItem value="ma">Master of Arts</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sport">Sport</Label>
                  <Input
                    id="sport"
                    placeholder="e.g., Basketball, Swimming, etc."
                    {...applicantRegisterForm.register('sport')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clubs">Clubs</Label>
                  <Input
                    id="clubs"
                    placeholder="e.g., Debate, Chess, etc."
                    {...applicantRegisterForm.register('clubs')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greekLife">Greek Life</Label>
                  <Select onValueChange={(value) => applicantRegisterForm.setValue('greekLife', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Greek organization (if any)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="alpha-phi-alpha">Alpha Phi Alpha</SelectItem>
                      <SelectItem value="chi-omega">Chi Omega</SelectItem>
                      <SelectItem value="delta-gamma">Delta Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Applicant Account'}
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
