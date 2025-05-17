
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
