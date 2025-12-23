import React, { useState } from 'react';
import API from '../services/api';
import { RefreshCw, Database } from 'lucide-react';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testDatabase = async () => {
    try {
      const response = await API.get('/test');
      setResult(response.data);
      console.log('Database test result:', response.data);
    } catch (error) {
      console.error('Test failed:', error);
      alert('Test failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetData = async () => {
    if (!window.confirm('This will clean ALL data (hackathons, students, applications). Are you sure?')) return;
    
    setLoading(true);
    try {
      const response = await API.post('/admin/reset-data');
      setResult(response.data);
      alert('Data cleaned successfully! System is now ready for real student registrations.');
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
      
      <div className="flex gap-2">
        <button
          onClick={resetData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
          {loading ? 'Cleaning...' : 'Clean All Data'}
        </button>
        
        <button
          onClick={testDatabase}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Database size={18} />
          Test Database
        </button>
      </div>
      
      {result && (
        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded-lg">
          <p className="text-blue-300 text-sm">📊 Database Status:</p>
          <p className="text-gray-400 text-xs mt-1">
            Applications: {result.counts?.applications || 0} | 
            Students: {result.counts?.students || 0} | 
            Hackathons: {result.counts?.hackathons || 0}
          </p>
          <details className="mt-2">
            <summary className="text-xs text-gray-500 cursor-pointer">View Raw Data</summary>
            <pre className="text-xs text-gray-400 mt-1 overflow-auto max-h-32">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;