import { useState } from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuthStore } from "../store/useAuthStore.js";
const Login = ({ isLogin = true }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(isLogin ? 'login' : 'signup');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role:''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoggingIn, signup, isRegistering } = useAuthStore();
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData({ email: '', password: '', username: '' });
    setError('');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const authFunc = activeTab === 'login' ? login : signup;
    const success = await authFunc(formData);

    if (success) {
      navigate("/home");
    } else {
      setError(activeTab === 'login'
        ? "Invalid email or password."
        : "Signup failed. Email may already be in use."
      );
    }

    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-amber-700 flex items-center justify-center">
            カタヒラ
            <span className="ml-2 text-stone-800">KataHira</span>
          </h1>
          <p className="text-stone-600 mt-2">Master Japanese the smart way</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200 animate-fade-in-up">
          {/* Tabs */}
          <div className="flex border-b border-stone-200">
            <button
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${activeTab === 'login' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={() => handleTabSwitch('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${activeTab === 'signup' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={() => handleTabSwitch('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {activeTab === 'signup' && (
                <div className="mb-4 animate-fade-in">
                  <label htmlFor="username" className="block text-sm font-medium text-stone-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      placeholder="Vansh Pandey"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4 animate-fade-in">
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6 animate-fade-in">
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
                  Password
                  {activeTab === 'signup' && (
                    <span className="text-xs text-stone-500 ml-1">(min. 8 characters)</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="••••••••"
                    minLength={activeTab === 'signup' ? 6 : 1}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
              {activeTab==='signup'&&(
                <div className="mb-6 animate-fade-in">
                <label htmlFor="role" className="block text-sm font-medium text-stone-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                >
                  <option value="">Select a role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              )}

              {activeTab === 'login' && (
                <div className="flex items-center justify-between mb-6 animate-fade-in">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {activeTab === 'login' ? 'Log in' : 'Sign up'}
                    <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activeTab === 'login' ? "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"}></path>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {activeTab === 'login' && (
              <div className="mt-6 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-stone-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-stone-300 rounded-lg shadow-sm bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all hover:-translate-y-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-stone-300 rounded-lg shadow-sm bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all hover:-translate-y-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="mt-6 text-center animate-fade-in">
                <p className="text-sm text-stone-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
                    onClick={() => setActiveTab('login')}
                  >
                    Log in
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-stone-500 animate-fade-in">
          <p>By continuing, you agree to our <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out forwards;
  }
`}</style>

    </div>
  );
};

export default Login;