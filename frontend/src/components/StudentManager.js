import React, { useState, useEffect } from 'react';
import { hackathonAPI, applicationAPI } from '../services/api';
import { exportToExcel, exportStudentListPDF, generateODLetter } from '../utils/exportUtils';
import { Download, FileText, Search, RefreshCw } from 'lucide-react';

const StudentManager = ({ hackathons }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ hackathonId: '', search: '' });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('Fetching all applications...');
      
      // Test if API is accessible
      const response = await applicationAPI.getAllApplications();
      console.log('API Response:', response);
      const data = response.data;
      console.log('Raw applications data:', data);
      console.log('Data type:', typeof data, 'Is array:', Array.isArray(data));
      
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        setStudents([]);
        return;
      }
      
      // Filter by hackathon if specified
      let filteredData = data;
      if (filters.hackathonId) {
        filteredData = data.filter(app => app.hackathon?._id === filters.hackathonId);
        console.log('Filtered by hackathon:', filteredData);
      }
      
      // Filter by search term
      const filteredStudents = filters.search ? 
        filteredData.filter(studentApp => 
          (studentApp.student?.name && studentApp.student.name.toLowerCase().includes(filters.search.toLowerCase())) ||
          (studentApp.student?.rollNumber && studentApp.student.rollNumber.toLowerCase().includes(filters.search.toLowerCase())) ||
          (studentApp.student?.department && studentApp.student.department.toLowerCase().includes(filters.search.toLowerCase()))
        ) : filteredData;
      
      console.log('Final filtered students:', filteredStudents);
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error fetching applications:', error);
      console.error('Error details:', error.response?.data || error.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    if (students.length === 0) return alert('No students to export.');
    
    const hackathonName = filters.hackathonId 
      ? hackathons.find(h => h._id === filters.hackathonId)?.name 
      : 'All Events';
    
    if (type === 'excel') exportToExcel(students, hackathonName);
    else if (type === 'pdf-list') exportStudentListPDF(students, hackathonName);
    else if (type === 'pdf-od') {
      const eventDate = students[0]?.hackathon?.dates[0] 
        ? new Date(students[0].hackathon.dates[0]).toLocaleDateString()
        : 'TBD';
      generateODLetter(students, hackathonName, eventDate);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-8 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Student Participation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <p className="text-2xl font-bold text-cyan-400">{students.length}</p>
            <p className="text-sm text-gray-300">Total Applications</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <p className="text-2xl font-bold text-green-400">{students.filter(s => s.status === 'approved').length}</p>
            <p className="text-sm text-gray-300">Approved</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <p className="text-2xl font-bold text-yellow-400">{students.filter(s => s.status === 'pending').length}</p>
            <p className="text-sm text-gray-300">Pending</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <p className="text-2xl font-bold text-red-400">{students.filter(s => s.status === 'rejected').length}</p>
            <p className="text-sm text-gray-300">Rejected</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Filter Students</h3>
          <button 
            onClick={fetchStudents}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            <RefreshCw size={18} />
            Refresh Data
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Name or Roll No..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={filters.hackathonId}
            onChange={(e) => setFilters({ ...filters, hackathonId: e.target.value })}
          >
            <option value="">All Hackathons</option>
            {hackathons.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleExport('excel')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download size={18} /> Export Excel
          </button>
          <button onClick={() => handleExport('pdf-list')} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <FileText size={18} /> PDF List
          </button>
          <button onClick={() => handleExport('pdf-od')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <FileText size={18} /> OD Letter
          </button>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Roll No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Year</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Section</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Hackathon</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Applied Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((app) => (
              <tr key={app._id} className="border-b border-gray-600 hover:bg-gray-700">
                <td className="px-6 py-4 font-medium text-white">{app.student?.name || 'Unknown'}</td>
                <td className="px-6 py-4 text-gray-300">{app.student?.rollNumber || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{app.student?.email || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-300">{app.student?.department || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-300">{app.student?.year || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-300">{app.student?.section || 'N/A'}</td>
                <td className="px-6 py-4 font-medium text-cyan-400">{app.hackathon?.name || 'Unknown Event'}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === 'approved' ? 'bg-green-800 text-green-200' : 
                    app.status === 'rejected' ? 'bg-red-800 text-red-200' :
                    'bg-yellow-800 text-yellow-200'
                  }`}>
                    {app.status?.toUpperCase() || 'PENDING'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading student applications...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">No students found</p>
            <p className="text-sm">No applications have been submitted yet or they don't match your filters.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StudentManager;
