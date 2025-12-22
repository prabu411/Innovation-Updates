import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [loginType, setLoginType] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '', year: '2', section: 'A' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login v1.0.1: Direct login attempt');

    // Validate Login Type
    if (loginType === 'student' && formData.email === 'admin@innovation.com') {
      setError('Admin login is not allowed in the student portal. Please switch to the Admin tab.');
      return;
    }

    try {
      const user = await login(formData.email, formData.password, formData.year, formData.section);
      
      if (loginType === 'admin' && user.role !== 'coordinator') {
        setError('Access Denied: You are not an admin.');
        return;
      }
      if (loginType === 'student' && user.role !== 'student' && user.role !== 'student_admin') {
        setError('Access Denied: Please use the Admin login for coordinator accounts.');
        return;
      }

      if (user.role === 'coordinator') navigate('/coordinator/dashboard');
      else if (user.role === 'student_admin') navigate('/student-admin/dashboard');
      else navigate('/student/dashboard');

    } catch (err) {
      console.error("Login component error:", err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md glassmorphism rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="text-center p-8 pb-0">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Portal Login</h2>
        </div>

        <div className="flex p-6 gap-4">
          <button onClick={() => setLoginType('student')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${loginType === 'student' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            <User size={18} /> Student
          </button>
          <button onClick={() => setLoginType('admin')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${loginType === 'admin' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            <ShieldCheck size={18} /> Admin
          </button>
        </div>

        <div className="p-8 pt-0">
          {error && <div className="mb-6 bg-red-500/10 text-red-200 px-4 py-3 rounded-lg text-sm border border-red-500/50">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="email" required placeholder="Email Address" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="password" required placeholder="Password" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            
            {loginType === 'student' && (
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white bg-gray-900">
                  <option value="1">I Year</option>
                  <option value="2">II Year</option>
                  <option value="3">III Year</option>
                  <option value="4">IV Year</option>
                </select>
                <select value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white bg-gray-900">
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            )}

            <button type="submit" className={`w-full py-3.5 rounded-xl font-bold text-white ${loginType === 'admin' ? 'bg-cyan-600' : 'bg-purple-600'}`}>
              {loginType === 'admin' ? 'Login to Dashboard' : 'Access Student Portal'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">New here? <Link to="/signup" className="font-semibold text-purple-400">Create an account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
