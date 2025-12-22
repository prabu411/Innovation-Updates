import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNumber: '',
    year: ''
  });
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await signup(formData);
      navigate(user.role === 'coordinator' ? '/coordinator/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg glassmorphism rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="text-center p-8 pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <UserPlus size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
            Create Your Account
          </h2>
          <p className="text-gray-400 text-sm">Join the Innovation Ecosystem</p>
        </div>

        <div className="p-8 pt-4">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <input type="password" placeholder="Password" required className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            
            <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="student">Role: Student</option>
              <option value="coordinator">Role: Innovation Coordinator</option>
            </select>

            {formData.role === 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Roll Number" required className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white" value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })} />
                <select required className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}>
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            )}

            {formData.role === 'student' && (
              <div className="mt-2">
                <label className="text-sm text-gray-400 mb-1 block">Section</label>
                <select required value={formData.section || ''} onChange={(e) => setFormData({ ...formData, section: e.target.value })} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white">
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-purple-500/25">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-400 hover:underline">
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
