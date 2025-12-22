import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, User, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const MainLogin = () => {
  const [loginType, setLoginType] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '', year: '2', section: 'A' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const checkServerHealth = async () => {
    try {
      const API_URL = process.env.NODE_ENV === 'production' 
        ? 'https://innovation-updates.onrender.com'
        : 'http://localhost:5003';
      await axios.get(`${API_URL}/api/health`);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(formData.email, formData.password, formData.year, formData.section);
      
      if (user.role === 'coordinator') navigate('/coordinator/dashboard');
      else if (user.role === 'student_admin') navigate('/student-admin/dashboard');
      else navigate('/student/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md glassmorphism rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center p-8 pb-0">
          <h2 className="text-3xl font-bold text-white">Main Portal Login</h2>
        </div>

        <div className="flex p-6 gap-4">
          <button onClick={() => setLoginType('student')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${loginType === 'student' ? 'bg-purple-600 text-white' : 'bg-gray-800'}`}>
            <User size={18} /> Student
          </button>
          <button onClick={() => setLoginType('admin')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${loginType === 'admin' ? 'bg-cyan-600 text-white' : 'bg-gray-800'}`}>
            <ShieldCheck size={18} /> Coordinator
          </button>
        </div>

        <div className="p-8 pt-0">
          {error && <div className="mb-4 text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="email" required placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 bg-gray-800 rounded-lg text-white" />
            <input type="password" required placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full p-3 bg-gray-800 rounded-lg text-white" />
            
            {loginType === 'student' && (
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full p-3 bg-gray-800 rounded-lg text-white">
                  <option>II Year</option>
                </select>
                <select value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} className="w-full p-3 bg-gray-800 rounded-lg text-white">
                  <option>A</option>
                </select>
              </div>
            )}

            <button type="submit" className={`w-full py-3 font-bold rounded-lg ${loginType === 'admin' ? 'bg-cyan-600' : 'bg-purple-600'}`}>Login</button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">New here? <Link to="/signup" className="font-semibold text-purple-400">Create an account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLogin;
