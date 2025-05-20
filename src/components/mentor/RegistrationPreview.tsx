import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { getAllUniversities, UniversityData } from "@/pages/insights/universities/universities-data";
import SearchInput from "@/components/SearchInput";
import { useForm } from "react-hook-form";
import { getMajors, Major } from "@/services/majors";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface RegistrationPreviewProps {
  registrationType?: 'student' | 'mentor';
}

const RegistrationPreview = ({ registrationType = 'student' }: RegistrationPreviewProps) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [universitySearchTerm, setUniversitySearchTerm] = useState<string>("");
  const [majorSearchTerm, setMajorSearchTerm] = useState<string>("");
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [majors, setMajors] = useState<Array<Major>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile-complete");
  
  // Fetch universities from Supabase
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setIsLoading(true);
        const data = await getAllUniversities();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to load universities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUniversities();
  }, []);

  // Fetch majors from Supabase
  useEffect(() => {
    const loadMajors = async () => {
      try {
        const data = await getMajors();
        setMajors(data);
      } catch (error) {
        console.error("Failed to load majors:", error);
      }
    };
    
    loadMajors();
  }, []);
  
  // Filter majors based on search term
  const filteredMajors = majors.filter(major => 
    major.name.toLowerCase().includes(majorSearchTerm.toLowerCase())
  ).slice(0, 5);

  // Handle image upload for preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getMentorSpecificContent = () => (
    <div className="space-y-4 mt-4">
      {/* Profile image is now part of the common content in profile-complete tab */}
      
      <div className="space-y-2">
        <Label htmlFor="work-experience">Work Experience (years)</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select years of experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-2">1-2 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="6-10">6-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="greek-life">Greek Life</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Greek organization (if any)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectGroup>
              <SelectLabel>Fraternities</SelectLabel>
              <SelectItem value="alpha-phi-alpha">Alpha Phi Alpha</SelectItem>
              <SelectItem value="sigma-chi">Sigma Chi</SelectItem>
              <SelectItem value="kappa-sigma">Kappa Sigma</SelectItem>
              <SelectItem value="sigma-alpha-epsilon">Sigma Alpha Epsilon</SelectItem>
              <SelectItem value="phi-delta-theta">Phi Delta Theta</SelectItem>
              <SelectItem value="pi-kappa-alpha">Pi Kappa Alpha</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Sororities</SelectLabel>
              <SelectItem value="alpha-chi-omega">Alpha Chi Omega</SelectItem>
              <SelectItem value="chi-omega">Chi Omega</SelectItem>
              <SelectItem value="delta-gamma">Delta Gamma</SelectItem>
              <SelectItem value="kappa-kappa-gamma">Kappa Kappa Gamma</SelectItem>
              <SelectItem value="alpha-phi">Alpha Phi</SelectItem>
              <SelectItem value="delta-delta-delta">Delta Delta Delta</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Pricing</Label>
        <p className="text-sm text-gray-500">Set rates for your mentoring sessions</p>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price-15">15 min session ($)</Label>
            <Input id="price-15" type="number" placeholder="25" min="0" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-30">30 min session ($)</Label>
            <Input id="price-30" type="number" placeholder="45" min="0" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-60">60 min session ($)</Label>
            <Input id="price-60" type="number" placeholder="80" min="0" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expertise">Areas of Expertise</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="admissions" />
            <Label htmlFor="admissions" className="text-sm font-normal">Admissions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="career" />
            <Label htmlFor="career" className="text-sm font-normal">Career</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="academic" />
            <Label htmlFor="academic" className="text-sm font-normal">Academic</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="industry" />
            <Label htmlFor="industry" className="text-sm font-normal">Industry</Label>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{registrationType === 'mentor' ? 'Mentor' : 'Student'} Registration Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="login" onClick={() => setActiveTab("login")}>Login</TabsTrigger>
            <TabsTrigger value="register" onClick={() => setActiveTab("register")}>Register</TabsTrigger>
            <TabsTrigger value="profile-complete" onClick={() => setActiveTab("profile-complete")}>Profile Completion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full">Sign in</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" placeholder="your@email.com" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>I am a:</Label>
                <RadioGroup defaultValue={registrationType} className="flex flex-col space-y-1">
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
              
              <Button className="w-full">Create account</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="profile-complete" className="space-y-4">
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">Complete Your Profile</h3>
                <p className="text-sm text-gray-500">Help others find you by completing your profile</p>
                
                <div className="mt-4">
                  <Progress value={40} className="h-2 w-full" />
                  <p className="text-xs text-gray-500 mt-1">
                    Profile completion: 40%
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Profile Image Upload - Only one instance for both students and mentors */}
                <div className="space-y-2">
                  <Label htmlFor="profile-image">Profile Image</Label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative cursor-pointer">
                      <Avatar className="w-24 h-24">
                        {imagePreview ? (
                          <AvatarImage src={imagePreview} alt="Profile preview" />
                        ) : (
                          <AvatarFallback className="bg-muted flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Click to upload your profile picture</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell others about yourself, your experiences, and what you can offer..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <SearchInput 
                    value={universitySearchTerm}
                    onChange={setUniversitySearchTerm}
                    placeholder={isLoading ? "Loading universities..." : "Type to search universities..."}
                    options={universities}
                    onOptionSelect={(university) => {
                      setSelectedUniversity(university.id);
                      setUniversitySearchTerm(university.name);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ba">BA - Bachelor of Arts</SelectItem>
                      <SelectItem value="bs">BS - Bachelor of Science</SelectItem>
                      <SelectItem value="bba">BBA - Bachelor of Business Administration</SelectItem>
                      <SelectItem value="bfa">BFA - Bachelor of Fine Arts</SelectItem>
                      <SelectItem value="ma">MA - Master of Arts</SelectItem>
                      <SelectItem value="ms">MS - Master of Science</SelectItem>
                      <SelectItem value="mba">MBA - Master of Business Administration</SelectItem>
                      <SelectItem value="meng">MEng - Master of Engineering</SelectItem>
                      <SelectItem value="mfa">MFA - Master of Fine Arts</SelectItem>
                      <SelectItem value="mph">MPH - Master of Public Health</SelectItem>
                      <SelectItem value="msw">MSW - Master of Social Work</SelectItem>
                      <SelectItem value="jd">JD - Juris Doctor</SelectItem>
                      <SelectItem value="md">MD - Doctor of Medicine</SelectItem>
                      <SelectItem value="phd">PhD - Doctor of Philosophy</SelectItem>
                      <SelectItem value="edd">EdD - Doctor of Education</SelectItem>
                      <SelectItem value="dnp">DNP - Doctor of Nursing Practice</SelectItem>
                      <SelectItem value="llm">LLM - Master of Laws</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <SearchInput
                    value={majorSearchTerm}
                    onChange={setMajorSearchTerm}
                    placeholder="Type to search majors..."
                    options={majors}
                    onOptionSelect={(major) => {
                      setMajorSearchTerm(major.name);
                    }}
                  />
                </div>
                
                {registrationType === 'student' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="greek-life-student">Greek Life</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Greek organization (if any)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectGroup>
                            <SelectLabel>Fraternities</SelectLabel>
                            <SelectItem value="alpha-phi-alpha">Alpha Phi Alpha</SelectItem>
                            <SelectItem value="sigma-chi">Sigma Chi</SelectItem>
                            <SelectItem value="kappa-sigma">Kappa Sigma</SelectItem>
                            <SelectItem value="sigma-alpha-epsilon">Sigma Alpha Epsilon</SelectItem>
                            <SelectItem value="phi-delta-theta">Phi Delta Theta</SelectItem>
                            <SelectItem value="pi-kappa-alpha">Pi Kappa Alpha</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Sororities</SelectLabel>
                            <SelectItem value="alpha-chi-omega">Alpha Chi Omega</SelectItem>
                            <SelectItem value="chi-omega">Chi Omega</SelectItem>
                            <SelectItem value="delta-gamma">Delta Gamma</SelectItem>
                            <SelectItem value="kappa-kappa-gamma">Kappa Kappa Gamma</SelectItem>
                            <SelectItem value="alpha-phi">Alpha Phi</SelectItem>
                            <SelectItem value="delta-delta-delta">Delta Delta Delta</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  
                    <div className="space-y-3">
                      <Label className="text-base">Activities</Label>
                      <p className="text-sm text-gray-500">Select the activities you're involved in</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="sports" />
                          <Label htmlFor="sports" className="text-sm font-normal">Sports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="music" />
                          <Label htmlFor="music" className="text-sm font-normal">Music</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="art" />
                          <Label htmlFor="art" className="text-sm font-normal">Art</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="tech" />
                          <Label htmlFor="tech" className="text-sm font-normal">Tech</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="volunteer" />
                          <Label htmlFor="volunteer" className="text-sm font-normal">Volunteering</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="research" />
                          <Label htmlFor="research" className="text-sm font-normal">Research</Label>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Mentor specific fields
                  getMentorSpecificContent()
                )}
                
                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="outline">Skip for now</Button>
                  <Button>Complete Profile</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RegistrationPreview;
