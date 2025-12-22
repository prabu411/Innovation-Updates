import React, { useState } from 'react';
import { Download, FileText, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import { exportToExcel, exportStudentListPDF, generateODLetter } from '../utils/exportUtils';

const ReportsManager = ({ hackathons, students }) => {
  const [selectedHackathon, setSelectedHackathon] = useState('');

  const getFilteredStudents = () => {
    if (selectedHackathon) {
      return students.filter(s => s.hackathon?._id === selectedHackathon);
    }
    return students;
  };

  const generateReport = (type) => {
    const filteredStudents = getFilteredStudents();
    if (filteredStudents.length === 0) {
      alert('No data available for the selected filters.');
      return;
    }

    const hackathonName = selectedHackathon 
      ? hackathons.find(h => h._id === selectedHackathon)?.name || 'Selected Event'
      : 'All Events';

    switch (type) {
      case 'excel':
        exportToExcel(filteredStudents, hackathonName);
        break;
      case 'pdf':
        exportStudentListPDF(filteredStudents, hackathonName);
        break;
      case 'od-letter':
        const eventDate = filteredStudents[0]?.hackathon?.dates?.[0] 
          ? new Date(filteredStudents[0].hackathon.dates[0]).toLocaleDateString()
          : 'TBD';
        generateODLetter(filteredStudents, hackathonName, eventDate);
        break;
    }
  };

  const getStats = () => {
    const filtered = getFilteredStudents();
    return {
      total: filtered.length,
      approved: filtered.filter(s => s.status === 'approved').length,
      pending: filtered.filter(s => s.status === 'pending').length,
      rejected: filtered.filter(s => s.status === 'rejected').length,
      departments: [...new Set(filtered.map(s => s.student?.department).filter(Boolean))].length
    };
  };

  const stats = getStats();

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h2>
        <p className="text-gray-400">Generate comprehensive reports and export student data</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Report Filters</h3>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Hackathon</label>
          <select
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
            value={selectedHackathon}
            onChange={(e) => setSelectedHackathon(e.target.value)}
          >
            <option value="">All Hackathons</option>
            {hackathons.map(h => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4">
            <Users className="text-cyan-400" size={32} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-green-400" size={32} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.approved}</p>
              <p className="text-sm text-gray-400">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4">
            <Calendar className="text-yellow-400" size={32} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4">
            <BarChart3 className="text-red-400" size={32} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.rejected}</p>
              <p className="text-sm text-gray-400">Rejected</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4">
            <Users className="text-purple-400" size={32} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.departments}</p>
              <p className="text-sm text-gray-400">Departments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-600 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Excel Report</h4>
                <p className="text-sm text-gray-400">Detailed spreadsheet with all student data</p>
              </div>
            </div>
            <button
              onClick={() => generateReport('excel')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download size={18} />
              Export Excel
            </button>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-600 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">PDF Report</h4>
                <p className="text-sm text-gray-400">Formatted student list for printing</p>
              </div>
            </div>
            <button
              onClick={() => generateReport('pdf')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-600 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">OD Letter</h4>
                <p className="text-sm text-gray-400">Official On-Duty letter for HOD</p>
              </div>
            </div>
            <button
              onClick={() => generateReport('od-letter')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Download size={18} />
              Generate OD Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManager;