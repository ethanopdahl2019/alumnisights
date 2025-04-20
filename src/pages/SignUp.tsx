
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignUpForm from '@/components/SignUpForm';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <SignUpForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
