
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getUniversitiesByLetter } from "@/pages/insights/universities/universities-data";

const RegistrationPreview = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Get universities from the same source as Schools page
  const universitiesByLetter = getUniversitiesByLetter();
  const allUniversities = Object.values(universitiesByLetter).flat();
  
  // Filter universities based on search term
  const filteredUniversities = searchTerm 
    ? allUniversities.filter(uni => 
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5) // Limit to 5 results for better UX
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="profile-complete">Profile Completion</TabsTrigger>
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
                <RadioGroup defaultValue="student" className="flex flex-col space-y-1">
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="university-search"
                      type="text"
                      placeholder="Type to search universities..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      list="university-options"
                    />
                    <datalist id="university-options">
                      {allUniversities.map((university) => (
                        <option key={university.id} value={university.name} />
                      ))}
                    </datalist>
                    
                    {searchTerm && filteredUniversities.length > 0 && (
                      <div className="absolute z-10 w-full bg-white mt-1 rounded-md border border-gray-200 shadow-md max-h-60 overflow-auto">
                        {filteredUniversities.map((university) => (
                          <div
                            key={university.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedUniversity(university.id);
                              setSearchTerm(university.name);
                            }}
                          >
                            {university.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="associates">Associate's Degree</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="business">Business Administration</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="psychology">Psychology</SelectItem>
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
