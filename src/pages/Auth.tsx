
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { signUp, signIn } from '@/services/auth';
import { getMajors } from '@/services/majors';
import { getSchools } from '@/services/profiles';
import UniversitySearchSelect from '@/components/UniversitySearchSelect';
import { School, Major } from '@/types/database';

// Define form schemas
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

const studentRegisterFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
  userType: z.enum(['student', 'mentor']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const mentorRegisterFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
  userType: z.enum(['student', 'mentor']),
  universityId: z.string().min(1, { message: 'University is required' }),
  majorId: z.string().min(1, { message: 'Major is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type StudentRegisterFormValues = z.infer<typeof studentRegisterFormSchema>;
type MentorRegisterFormValues = z.infer<typeof mentorRegisterFormSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [userType, setUserType] = useState<'student' | 'mentor'>('student');
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>("");
  const navigate = useNavigate();
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Student register form
  const studentRegisterForm = useForm<StudentRegisterFormValues>({
    resolver: zodResolver(studentRegisterFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'student',
    },
  });

  // Mentor register form
  const mentorRegisterForm = useForm<MentorRegisterFormValues>({
    resolver: zodResolver(mentorRegisterFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'mentor',
      universityId: '',
      majorId: '',
    },
  });

  // Load schools and majors from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsData, majorsData] = await Promise.all([
          getSchools(),
          getMajors()
        ]);
        setSchools(schoolsData);
        setMajors(majorsData);
      } catch (error) {
        console.error("Failed to load form data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load schools and majors. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    if (userType === 'mentor') {
      fetchData();
    }
  }, [userType]);

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

  // Handle student register
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
          role: 'student'
        }
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email to verify your account.",
      });

      await signIn({ email, password });
      navigate('/profile-complete');
      
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

  // Handle mentor register
  const onMentorRegisterSubmit = async (values: MentorRegisterFormValues) => {
    setIsLoading(true);
    try {
      const { email, password, firstName, lastName, universityId, majorId } = values;

      await signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        metadata: {
          role: 'mentor',
          university_id: universityId, // Store university ID instead of school ID
          major_id: majorId
        }
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please complete your mentor profile.",
      });

      await signIn({ email, password });
      navigate('/mentor-profile-complete');
      
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
    studentRegisterForm.setValue('userType', value as 'student' | 'mentor');
    mentorRegisterForm.setValue('userType', value as 'student' | 'mentor');
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
              <div className="space-y-4">
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

                {userType === 'student' ? (
                  <form onSubmit={studentRegisterForm.handleSubmit(onStudentRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          {...studentRegisterForm.register('firstName')} 
                        />
                        {studentRegisterForm.formState.errors.firstName && (
                          <p className="text-red-500 text-sm">{studentRegisterForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          {...studentRegisterForm.register('lastName')} 
                        />
                        {studentRegisterForm.formState.errors.lastName && (
                          <p className="text-red-500 text-sm">{studentRegisterForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input 
                        id="reg-email" 
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
                        <Label htmlFor="reg-password">Password</Label>
                        <Input 
                          id="reg-password" 
                          type="password" 
                          placeholder="••••••••" 
                          {...studentRegisterForm.register('password')} 
                        />
                        {studentRegisterForm.formState.errors.password && (
                          <p className="text-red-500 text-sm">{studentRegisterForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input 
                          id="confirmPassword" 
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
                      {isLoading ? 'Creating account...' : 'Create student account'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={mentorRegisterForm.handleSubmit(onMentorRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mentor-firstName">First Name</Label>
                        <Input 
                          id="mentor-firstName" 
                          placeholder="John" 
                          {...mentorRegisterForm.register('firstName')} 
                        />
                        {mentorRegisterForm.formState.errors.firstName && (
                          <p className="text-red-500 text-sm">{mentorRegisterForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mentor-lastName">Last Name</Label>
                        <Input 
                          id="mentor-lastName" 
                          placeholder="Doe" 
                          {...mentorRegisterForm.register('lastName')} 
                        />
                        {mentorRegisterForm.formState.errors.lastName && (
                          <p className="text-red-500 text-sm">{mentorRegisterForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mentor-email">Email</Label>
                      <Input 
                        id="mentor-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        {...mentorRegisterForm.register('email')} 
                      />
                      {mentorRegisterForm.formState.errors.email && (
                        <p className="text-red-500 text-sm">{mentorRegisterForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mentor-password">Password</Label>
                        <Input 
                          id="mentor-password" 
                          type="password" 
                          placeholder="••••••••" 
                          {...mentorRegisterForm.register('password')} 
                        />
                        {mentorRegisterForm.formState.errors.password && (
                          <p className="text-red-500 text-sm">{mentorRegisterForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mentor-confirmPassword">Confirm Password</Label>
                        <Input 
                          id="mentor-confirmPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          {...mentorRegisterForm.register('confirmPassword')} 
                        />
                        {mentorRegisterForm.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-sm">{mentorRegisterForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <UniversitySearchSelect
                        value={selectedUniversityId}
                        onSelect={(universityId) => {
                          setSelectedUniversityId(universityId);
                          mentorRegisterForm.setValue('universityId', universityId);
                        }}
                        placeholder="Type to search universities..."
                      />
                      {mentorRegisterForm.formState.errors.universityId && (
                        <p className="text-red-500 text-sm">{mentorRegisterForm.formState.errors.universityId.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="major">Major</Label>
                      <Select 
                        onValueChange={(value) => mentorRegisterForm.setValue('majorId', value)}
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
                      {mentorRegisterForm.formState.errors.majorId && (
                        <p className="text-red-500 text-sm">{mentorRegisterForm.formState.errors.majorId.message}</p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create mentor account'}
                    </Button>
                  </form>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
