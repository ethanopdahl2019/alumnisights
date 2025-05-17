
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
import { getAllUniversities, UniversityData } from '@/pages/insights/universities/universities-data';
import SearchInput from '@/components/SearchInput';
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

const registerFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
  userType: z.enum(['student', 'mentor']),
  schoolId: z.string().optional(),
  degree: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    // If user is a mentor, schoolId and degree are required
    if (data.userType === 'mentor') {
      return !!data.schoolId && !!data.degree;
    }
    return true;
  },
  {
    message: "School and degree are required for mentors",
    path: ["schoolId"],
  }
);

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [userType, setUserType] = useState<'student' | 'mentor'>('student');
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
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
      degree: '',
    },
  });

  // Load universities from Supabase
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await getAllUniversities();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to load universities:", error);
      }
    };
    
    fetchUniversities();
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
      const { email, password, firstName, lastName, userType, schoolId, degree } = values;

      // Map the userType to the correct role
      const role = userType === 'mentor' ? 'mentor' : 'student';

      await signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        metadata: {
          user_type: userType,
          role: role,
          school_id: userType === 'mentor' ? schoolId : null,
          degree: userType === 'mentor' ? degree : null
        }
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email to verify your account.",
      });

      await signIn({ email, password });
      
      // Redirect based on user role
      if (userType === "mentor") {
        navigate('/profile/complete');
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
                
                {userType === 'mentor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <SearchInput 
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Type to search universities..."
                        options={universities}
                        onOptionSelect={(university) => {
                          setSelectedUniversity(university.id);
                          setSearchTerm(university.name);
                          registerForm.setValue('schoolId', university.id);
                        }}
                      />
                      {registerForm.formState.errors.schoolId && (
                        <p className="text-red-500 text-sm">{registerForm.formState.errors.schoolId.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree</Label>
                      <Select 
                        onValueChange={(value) => registerForm.setValue('degree', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your degree" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ba">BA - Bachelor of Arts</SelectItem>
                          <SelectItem value="bs">BS - Bachelor of Science</SelectItem>
                          <SelectItem value="ma">MA - Master of Arts</SelectItem>
                          <SelectItem value="ms">MS - Master of Science</SelectItem>
                          <SelectItem value="mba">MBA - Master of Business Administration</SelectItem>
                          <SelectItem value="md">MD - Doctor of Medicine</SelectItem>
                          <SelectItem value="jd">JD - Juris Doctor</SelectItem>
                          <SelectItem value="mph">MPH - Master of Public Health</SelectItem>
                          <SelectItem value="meng">MEng - Master of Engineering</SelectItem>
                          <SelectItem value="mfa">MFA - Master of Fine Arts</SelectItem>
                          <SelectItem value="phd">PhD - Doctor of Philosophy</SelectItem>
                          <SelectItem value="edd">EdD - Doctor of Education</SelectItem>
                          <SelectItem value="dnp">DNP - Doctor of Nursing Practice</SelectItem>
                          <SelectItem value="msw">MSW - Master of Social Work</SelectItem>
                          <SelectItem value="bba">BBA - Bachelor of Business Administration</SelectItem>
                          <SelectItem value="bfa">BFA - Bachelor of Fine Arts</SelectItem>
                          <SelectItem value="llm">LLM - Master of Laws</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {registerForm.formState.errors.degree && (
                        <p className="text-red-500 text-sm">{registerForm.formState.errors.degree.message}</p>
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
