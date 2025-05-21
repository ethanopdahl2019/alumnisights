
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Alumni Network
            </Link>
            <div>
              <Link to="/auth" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the Alumni Network
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Connect with alumni, share experiences, and build your professional network.
          </p>
          <Link to="/browse" className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700">
            Browse Alumni
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Featured Alumni
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                John Doe
              </h3>
              <p className="text-gray-700">
                Software Engineer at Google
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Jane Smith
              </h3>
              <p className="text-gray-700">
                Marketing Manager at Amazon
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                David Lee
              </h3>
              <p className="text-gray-700">
                Data Scientist at Facebook
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-200 py-4 text-center">
        <p className="text-gray-700">
          &copy; 2023 Alumni Network
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
