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
import { toast } from 'sonner';
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

// Sample major data for registration
const MAJORS = [
  { id: "cs", name: "Computer Science" },
  { id: "neuro", name: "Neuroscience" },
  { id: "ph", name: "Public Health" },
  { id: "mech", name: "Mechanical Engineering" },
  { id: "bio", name: "Biomedical Engineering" },
  { id: "econ", name: "Economics" },
  { id: "psych", name: "Psychology" },
  { id: "polisci", name: "Political Science" },
  { id: "biochem", name: "Biochemistry" },
  { id: "molbio", name: "Molecular Biology" },
  { id: "socio", name: "Sociology" },
  { id: "env", name: "Environmental Science" },
  { id: "stats", name: "Statistics" },
  { id: "phys", name: "Physics" },
  { id: "chem", name: "Chemistry" },
  { id: "ee", name: "Electrical Engineering" },
  { id: "ai", name: "Artificial Intelligence" },
  { id: "genetics", name: "Genetics" },
  { id: "anthro", name: "Anthropology" },
  { id: "edpolicy", name: "Education Policy" },
  { id: "finance", name: "Finance" },
  { id: "ling", name: "Linguistics" },
  { id: "cogsci", name: "Cognitive Science" },
  { id: "healthinfo", name: "Health Informatics" },
  { id: "urban", name: "Urban Planning" },
  { id: "busadmin", name: "Business Administration" },
  { id: "acct", name: "Accounting" },
  { id: "mktg", name: "Marketing" },
  { id: "scm", name: "Supply Chain Management" },
  { id: "is", name: "Information Systems" },
  { id: "mgmt", name: "Management Science" },
  { id: "entrep", name: "Entrepreneurship" },
  { id: "ir", name: "International Relations" },
  { id: "phil", name: "Philosophy" },
  { id: "hist", name: "History" },
  { id: "eng", name: "English" },
  { id: "compli", name: "Comparative Literature" },
  { id: "reli", name: "Religious Studies" },
  { id: "arthistory", name: "Art History" },
  { id: "studioart", name: "Studio Art" },
  { id: "gd", name: "Graphic Design" },
  { id: "film", name: "Film and Media Studies" },
  { id: "journ", name: "Journalism" },
  { id: "comm", name: "Communications" },
  { id: "theater", name: "Theater and Performance Studies" },
  { id: "music", name: "Music" },
  { id: "arch", name: "Architecture" },
  { id: "ce", name: "Civil Engineering" },
  { id: "ie", name: "Industrial Engineering" },
  { id: "cheme", name: "Chemical Engineering" },
  { id: "aero", name: "Aerospace Engineering" },
  { id: "mse", name: "Materials Science and Engineering" },
  { id: "datascience", name: "Data Science" },
  { id: "cybersec", name: "Cybersecurity" },
  { id: "robotics", name: "Robotics" },
  { id: "applied-math", name: "Applied Mathematics" },
  { id: "pure-math", name: "Pure Mathematics" },
  { id: "actuary", name: "Actuarial Science" },
  { id: "marine-bio", name: "Marine Biology" },
  { id: "eco-evo", name: "Ecology and Evolutionary Biology" },
  { id: "geo", name: "Geology" },
  { id: "geog", name: "Geography" },
  { id: "astro", name: "Astronomy" },
  { id: "climate", name: "Climate Science" },
  { id: "ag", name: "Agricultural Science" },
  { id: "nutrition", name: "Nutrition" },
  { id: "nursing", name: "Nursing" },
  { id: "ot", name: "Occupational Therapy" },
  { id: "pt", name: "Physical Therapy" },
  { id: "kinesio", name: "Kinesiology" },
  { id: "sports", name: "Sports Management" },
  { id: "crim", name: "Criminology" },
  { id: "law", name: "Law and Society" },
  { id: "gender", name: "Gender Studies" },
  { id: "ethnic", name: "Ethnic Studies" },
  { id: "afam", name: "African American Studies" },
  { id: "latinx", name: "Latinx Studies" },
  { id: "asian", name: "Asian American Studies" },
  { id: "native", name: "Native American Studies" },
  { id: "mideast", name: "Middle Eastern Studies" },
  { id: "jewish", name: "Jewish Studies" },
  { id: "latam", name: "Latin American Studies" },
  { id: "dev", name: "Development Studies" },
  { id: "peace", name: "Peace and Conflict Studies" },
  { id: "globalhealth", name: "Global Health" },
  { id: "policy", name: "Public Policy" },
  { id: "socialwork", name: "Social Work" },
  { id: "humdev", name: "Human Development" },
  { id: "ed", name: "Education" },
  { id: "ece", name: "Early Childhood Education" },
  { id: "sped", name: "Special Education" },
  { id: "speech", name: "Speech and Hearing Sciences" },
  { id: "asl", name: "American Sign Language" },
  { id: "gamedesign", name: "Game Design" },
  { id: "ixd", name: "Interaction Design" },
  { id: "hci", name: "Human-Computer Interaction" }
];

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
  majorId: z.string().optional(),
  degree: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [userType, setUserType] = useState<'student' | 'mentor'>('student');
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [universitySearchTerm, setUniversitySearchTerm] = useState<string>("");
  const [majorSearchTerm, setMajorSearchTerm] = useState<string>("");
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

  // Filter majors based on search term
  const filteredMajors = MAJORS.filter(major => 
    major.name.toLowerCase().includes(majorSearchTerm.toLowerCase())
  ).slice(0, 5);

  // Handle login
  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      await signIn({ email, password });
      toast("Login successful", {
        description: "Welcome back!"
      });
      navigate('/student-dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast("Login failed", {
        description: error.message || "Failed to login. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { email, password, firstName, lastName, userType } = values;

      // Map the userType to the correct role
      const role = userType === 'mentor' ? 'alumni' : 'applicant';

      await signUp({ 
        email, 
        password, 
        firstName, 
        lastName,
        metadata: {
          user_type: userType,
          role: role,
          school_id: selectedUniversity || null,
          major_id: selectedMajor || null,
          degree: values.degree || null
        }
      });

      toast("Registration successful", {
        description: "Your account has been created. Please check your email to verify your account."
      });

      await signIn({ email, password });
      
      // Redirect based on user role - always send mentors to profile completion
      if (userType === "mentor") {
        navigate('/profile-complete');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast("Registration failed", {
        description: error.message || "Failed to create account. Please try again."
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

                {/* Hidden fields to store university and major information - no longer required */}
                <input type="hidden" {...registerForm.register('schoolId')} value={selectedUniversity} />
                <input type="hidden" {...registerForm.register('majorId')} value={selectedMajor} />
                <input type="hidden" {...registerForm.register('degree')} />
                
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
