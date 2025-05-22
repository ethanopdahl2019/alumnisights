
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { signUp, signIn } from '@/services/auth';
import { getMajors } from '@/services/majors';
import { getUniversities } from '@/services/universities';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Define form schemas
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

// Create variable registration form schema based on user type
const registerFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
  userType: z.enum(['student', 'mentor']),
  schoolId: z.string().optional(),
  majorId: z.string().optional(),
}).refine(
  (data) => data.password === data.confirmPassword, 
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
).refine(
  (data) => {
    // Only require school and major if user is a mentor
    if (data.userType === 'mentor') {
      return !!data.schoolId && !!data.majorId;
    }
    return true;
  },
  {
    message: "School and major are required for mentors",
    path: ["schoolId"],
  }
);

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface University {
  id: string;
  name: string;
}

interface Major {
  id: string;
  name: string;
  category: string | null;
}

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [userType, setUserType] = useState<'student' | 'mentor'>('student');
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
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
      confirmPassword: '',
      userType: 'student',
      schoolId: '',
      majorId: '',
    },
  });

  // Load universities and majors from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesData, majorsData] = await Promise.all([
          getUniversities(),
          getMajors()
        ]);
        setUniversities(universitiesData);
        setMajors(majorsData);
      } catch (error) {
        console.error("Failed to load form data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load universities and majors. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, []);

  // Handle login
  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      await signIn({ email, password });
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/student-dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { email, password, firstName, lastName, userType, schoolId, majorId } = values;

      // Map the userType to the correct role
      const role = userType === 'mentor' ? 'mentor' : 'student';

      // Only include school and major for mentors
      const metadata: Record<string, any> = { role };
      if (userType === 'mentor' && schoolId && majorId) {
        metadata.school_id = schoolId;
        metadata.major_id = majorId;
      }

      await signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        metadata
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email to verify your account.",
      });

      await signIn({ email, password });
      
      // Redirect based on user role
      if (userType === "mentor") {
        navigate('/mentor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeChange = (value: string) => {
    setUserType(value as 'student' | 'mentor');
    registerForm.setValue('userType', value as 'student' | 'mentor');
    
    // Clear school and major values if switching to student
    if (value === 'student') {
      registerForm.setValue('schoolId', '');
      registerForm.setValue('majorId', '');
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
                
                <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      {...registerForm.register('confirmPassword')} 
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup 
                    value={userType} 
                    onValueChange={handleUserTypeChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="font-normal">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mentor" id="mentor" />
                      <Label htmlFor="mentor" className="font-normal">Mentor</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Only show University and Major fields for mentors */}
                {userType === 'mentor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="school">University</Label>
                      <Select 
                        onValueChange={(value) => registerForm.setValue('schoolId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your university" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((university) => (
                            <SelectItem key={university.id} value={university.id}>
                              {university.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {registerForm.formState.errors.schoolId && (
                        <p className="text-red-500 text-sm">{registerForm.formState.errors.schoolId.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="major">Major</Label>
                      <Select 
                        onValueChange={(value) => registerForm.setValue('majorId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your major" />
                        </SelectTrigger>
                        <SelectContent>
                          {majors.map((major) => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {registerForm.formState.errors.majorId && (
                        <p className="text-red-500 text-sm">{registerForm.formState.errors.majorId.message}</p>
                      )}
                    </div>
                  </>
                )}
                
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
