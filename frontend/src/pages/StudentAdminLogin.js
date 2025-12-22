import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const StudentAdminLogin = () => {
  const [formData, setFormData] = useState({ email: 'studentinnovation@gmail.com', password: 'stu1234' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'student_admin') {
        navigate('/student-admin/dashboard');
      } else {
        setError('Access Denied: Not a Student Innovation Admin.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 glassmorphism rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck size={48} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Student Admin Portal</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" required placeholder="Email" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" required placeholder="Password" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          {error && <p className="text-red-400">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold">Login</button>
        </form>
      </div>
    </div>
  );
};

export default StudentAdminLogin;
