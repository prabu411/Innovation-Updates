import React, { useState } from 'react';
import API from '../services/api';
import { RefreshCw, Database } from 'lucide-react';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const resetData = async () => {
    if (!window.confirm('This will reset ALL data. Are you sure?')) return;
    
    setLoading(true);
    try {
      const response = await API.post('/admin/reset-data');
      setResult(response.data);
      alert('Data reset successful! Refresh the page to see changes.');
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Reset failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 mb-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Database className="text-red-400" />
        Admin Panel
      </h3>
      
      <button
        onClick={resetData}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
        {loading ? 'Resetting...' : 'Reset Production Data'}
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-lg">
          <p className="text-green-300 text-sm">✅ {result.message}</p>
          <p className="text-gray-400 text-xs mt-1">
            Created: {result.summary?.hackathons} hackathons, {result.summary?.students} students, {result.summary?.applications} applications
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;