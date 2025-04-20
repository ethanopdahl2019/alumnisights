
import { useState } from 'react';

type UserType = 'student' | 'prospect';

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    school: '',
    graduationYear: '',
    major: '',
    bio: '',
    profileImage: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profileImage: e.target.files![0]
      }));
    }
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    // In a real application, you would send this data to your backend
    alert('Account created successfully! You would be redirected to the next step.');
  };

  return (
    <div className="max-w-xl mx-auto">
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-8">Join AlumniSights</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <button
              className={`p-8 rounded-xl border ${
                userType === 'student' 
                  ? 'border-navy bg-navy/5' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition-colors focus:outline-none text-left`}
              onClick={() => setUserType('student')}
            >
              <h3 className="text-xl font-medium mb-2">I'm a Student/Alumni</h3>
              <p className="text-gray-600">
                I want to share insights about my school experience and earn money
              </p>
            </button>
            
            <button
              className={`p-8 rounded-xl border ${
                userType === 'prospect' 
                  ? 'border-navy bg-navy/5' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition-colors focus:outline-none text-left`}
              onClick={() => setUserType('prospect')}
            >
              <h3 className="text-xl font-medium mb-2">I'm Looking for Schools</h3>
              <p className="text-gray-600">
                I want to connect with current students and alumni
              </p>
            </button>
          </div>
          
          <div className="mt-10">
            <button 
              className="btn-primary w-full"
              disabled={!userType}
              onClick={handleNext}
            >
              Continue
            </button>
            
            <p className="mt-4 text-gray-600">
              Already have an account? <a href="/sign-in" className="text-navy hover:underline">Sign in</a>
            </p>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-medium mb-8">Create Your Account</h2>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                required
              />
            </div>
            
            <div className="pt-4 flex justify-between">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBack}
              >
                Back
              </button>
              
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      )}
      
      {step === 3 && userType === 'student' && (
        <div>
          <h2 className="text-2xl font-medium mb-8">Create Your Profile</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                School
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <select
                  id="graduationYear"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                  required
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i - 5).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                required
              />
            </div>
            
            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleFileChange}
                className="w-full"
                accept="image/*"
              />
            </div>
            
            <div className="pt-4 flex justify-between">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBack}
              >
                Back
              </button>
              
              <button
                type="submit"
                className="btn-primary"
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      )}
      
      {step === 3 && userType === 'prospect' && (
        <div>
          <h2 className="text-2xl font-medium mb-8">Tell Us About Yourself</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What type of schools are you interested in?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Ivy League', 'Liberal Arts', 'Public Universities', 'Technical Schools', 'Community Colleges', 'International'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What are you looking to study?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Business', 'Engineering', 'Liberal Arts', 'Sciences', 'Arts', 'Medicine', 'Law', 'Undecided'].map((field) => (
                  <label key={field} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    {field}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What aspects of college life are most important to you?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Academics', 'Social Life', 'Athletics', 'Career Opportunities', 'Campus Culture', 'Location', 'Cost'].map((aspect) => (
                  <label key={aspect} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    {aspect}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBack}
              >
                Back
              </button>
              
              <button
                type="submit"
                className="btn-primary"
              >
                Complete Setup
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
