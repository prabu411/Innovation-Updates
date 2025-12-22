import React, { useEffect, useState } from 'react';
import API from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ParticipantTracker = ({ hackathons = [] }) => {
  const [filters, setFilters] = useState({ hackathonId: '', department: '', year: '', status: 'all', search: '' });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/hackathons/participants', { params: filters });
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => fetchStudents();

  const exportToExcel = () => {
    if (!students || students.length === 0) return alert('No students to export');
    const ws = XLSX.utils.json_to_sheet(students.map(s => ({
      Name: s.name,
      'Roll No': s.rollNumber,
      Department: s.department,
      Year: s.year,
      Hackathon: s.hackathon?.name,
      Status: s.status,
      Date: new Date(s.createdAt).toLocaleDateString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    XLSX.writeFile(wb, `Participants_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    if (!students || students.length === 0) return alert('No students to export');
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Participants List', 14, 20);
    const body = students.map(s => [s.name, s.rollNumber || '', s.department || '', s.year || '', s.hackathon?.name || '', s.status]);
    doc.autoTable({ head: [['Name', 'Roll No', 'Department', 'Year', 'Hackathon', 'Status']], body, startY: 30 });
    doc.save(`Participants_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateODLetter = () => {
    if (!students || students.length === 0) return alert('No students');
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('ON-DUTY REQUEST', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('To: Head of Department', 20, 40);
    doc.text('From: Innovation Coordinator', 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text('Subject: Permission for students to attend innovation event', 20, 70);

    const rows = students.map(s => [s.name, s.rollNumber || '']);
    const unique = Array.from(new Map(rows.map(r => [r[1], r])).values());

    doc.autoTable({ startY: 90, head: [['Student Name', 'Roll Number']], body: unique, theme: 'grid' });
    doc.save(`OD_Letter_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Student Participation Tracking</h2>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="px-3 py-2 bg-green-600 rounded text-white">Export Excel</button>
          <button onClick={exportToPDF} className="px-3 py-2 bg-blue-600 rounded text-white">PDF List</button>
          <button onClick={generateODLetter} className="px-3 py-2 bg-purple-600 rounded text-white">OD Letter</button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <select value={filters.hackathonId} onChange={(e) => handleFilterChange('hackathonId', e.target.value)} className="bg-gray-700 text-white px-3 py-2 rounded">
          <option value="">All Hackathons</option>
          {hackathons.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
        <input placeholder="Department" value={filters.department} onChange={(e)=>handleFilterChange('department', e.target.value)} className="bg-gray-700 text-white px-3 py-2 rounded" />
        <input placeholder="Year" value={filters.year} onChange={(e)=>handleFilterChange('year', e.target.value)} className="bg-gray-700 text-white px-3 py-2 rounded w-24" />
        <select value={filters.status} onChange={(e)=>handleFilterChange('status', e.target.value)} className="bg-gray-700 text-white px-3 py-2 rounded">
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="registered">Registered</option>
        </select>
        <input placeholder="Search" value={filters.search} onChange={(e)=>handleFilterChange('search', e.target.value)} className="bg-gray-700 text-white px-3 py-2 rounded flex-1" />
        <button onClick={applyFilters} className="px-3 py-2 bg-indigo-600 rounded text-white">Filter Students</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 text-left text-gray-400">Name</th>
              <th className="p-2 text-left text-gray-400">Roll No</th>
              <th className="p-2 text-left text-gray-400">Department</th>
              <th className="p-2 text-left text-gray-400">Year</th>
              <th className="p-2 text-left text-gray-400">Hackathon</th>
              <th className="p-2 text-left text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="p-3 text-gray-400" colSpan="6">Loading...</td></tr>}
            {!loading && students.length === 0 && (
              <tr><td className="p-3 text-gray-400" colSpan="6">No students found for the selected filters.</td></tr>
            )}
            {!loading && students.map(s => (
              <tr key={`${s.studentId}_${s.hackathon?._id}`} className="hover:bg-gray-700/50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.rollNumber || '-'}</td>
                <td className="p-3">{s.department || '-'}</td>
                <td className="p-3">{s.year || '-'}</td>
                <td className="p-3">{s.hackathon?.name || '-'}</td>
                <td className="p-3 capitalize">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantTracker;