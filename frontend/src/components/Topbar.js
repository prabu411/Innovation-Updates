import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, UserCircle } from 'lucide-react';

const Topbar = ({ pageTitle }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white capitalize">
        {pageTitle.replace(/-/g, ' ')}
      </h2>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-white">{user?.name}</p>
          <p className="text-sm text-gray-400">Innovation Coordinator</p>
        </div>
        <UserCircle size={36} className="text-cyan-400" />
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
