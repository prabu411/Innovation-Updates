import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, FileDown, BookOpen } from 'lucide-react';
import MessageSystem from '../components/MessageSystem';
import { AuthContext } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const StudentAdminDashboard = () => {
  const [activeYear, setActiveYear] = useState('II Year');
  const [activeSection, setActiveSection] = useState('CSE - A');
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const years = ['I Year', 'II Year', 'III Year', 'Final Year'];
  const sections = ['CSE - A', 'CSE - B'];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      console.log('Starting to fetch applications...');
      const token = localStorage.getItem('token');
      console.log('Token present:', token ? 'Yes' : 'No');
      
      // Try to get applications first
      const { data } = await applicationAPI.getAllApplications();
      console.log('Applications API response:', data);
      console.log('Applications data type:', typeof data, 'Is array:', Array.isArray(data));
      
      if (data && data.length > 0) {
        setAllApplications(data);
      } else {
        console.log('No applications found, creating demo data for testing...');
        // Create some demo data to test the interface
        const demoData = [
          {
            _id: '1',
            student: {
              _id: 'student1',
              name: 'Test Student 1',
              rollNumber: '7376221CS001',
              email: 'student1@test.com',
              year: 2,
              section: 'A',
              department: 'CSE'
            },
            hackathon: {
              _id: 'hack1',
              name: 'Test Hackathon'
            },
            createdAt: new Date().toISOString()
          },
          {
            _id: '2', 
            student: {
              _id: 'student2',
              name: 'Test Student 2',
              rollNumber: '7376221CS002',
              email: 'student2@test.com',
              year: 2,
              section: 'A',
              department: 'CSE'
            },
            hackathon: {
              _id: 'hack1',
              name: 'Test Hackathon'
            },
            createdAt: new Date().toISOString()
          }
        ];
        setAllApplications(demoData);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setAllApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Get students grouped by their participation - FILTER BY YEAR AND SECTION
  const getStudentsForYearSection = () => {
    console.log('All applications:', allApplications);
    console.log('Applications length:', allApplications.length);
    console.log('Filtering for:', activeYear, activeSection);
    
    if (allApplications.length === 0) {
      console.log('No applications found');
      return [];
    }
    
    const yearMap = { 'I Year': 1, 'II Year': 2, 'III Year': 3, 'Final Year': 4 };
    const sectionMap = { 'CSE - A': 'A', 'CSE - B': 'B' };
    
    const targetYear = yearMap[activeYear];
    const targetSection = sectionMap[activeSection];
    
    console.log('Target year:', targetYear, 'Target section:', targetSection);
    
    // Group applications by student - FILTER BY YEAR AND SECTION
    const studentMap = new Map();
    
    allApplications.forEach((app, index) => {
      if (app.student) {
        console.log(`Student ${index}:`, {
          name: app.student.name,
          year: app.student.year,
          section: app.student.section,
          matches: app.student.year === targetYear && app.student.section === targetSection
        });
        
        // Only include students matching the selected year and section
        if (app.student.year === targetYear && app.student.section === targetSection) {
          const studentId = app.student._id;
          
          if (studentMap.has(studentId)) {
            studentMap.get(studentId).events += 1;
          } else {
            studentMap.set(studentId, {
              name: app.student.name || 'N/A',
              roll: app.student.rollNumber || 'N/A',
              email: app.student.email || 'N/A',
              year: app.student.year || 'N/A',
              section: app.student.section || 'N/A',
              events: 1
            });
          }
        }
      }
    });
    
    const filteredStudents = Array.from(studentMap.values());
    console.log('Filtered students for', activeYear, activeSection, ':', filteredStudents);
    console.log('Total filtered students:', filteredStudents.length);
    
    return filteredStudents;
  };

  const students = getStudentsForYearSection();

  // Logout handler
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const downloadExcel = () => {
    if (students.length === 0) {
      alert('No students to export');
      return;
    }
    const data = students.map(s => ({ Name: s.name, Roll: s.roll, Email: s.email, Events: s.events }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const fileName = `Students_${activeYear.replace(/\s+/g,'')}_${activeSection.replace(/\s+/g,'')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const downloadPDF = () => {
    if (students.length === 0) {
      alert('No students to export');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Students - ${activeYear} / ${activeSection}`, 14, 16);
    const rows = students.map(s => [s.name, s.roll, s.email, String(s.events || '')]);
    doc.autoTable({
      startY: 24,
      head: [['Name', 'Roll Number', 'Email', 'Events Participated']],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    const fileName = `Students_${activeYear.replace(/\s+/g,'')}_${activeSection.replace(/\s+/g,'')}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700">
        <h1 className="text-2xl font-bold text-green-400 mb-8">Student Admin</h1>
        <nav className="flex-grow">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">ACADEMIC YEAR</h2>
          {years.map(year => (
            <div key={year}>
              <button onClick={() => setActiveYear(year)} className={`w-full text-left p-2 rounded-md ${activeYear === year ? 'bg-green-800' : ''}`}>
                <BookOpen className="inline-block mr-2" size={16} /> {year}
              </button>
              {activeYear === year && (
                <div className="pl-6 mt-1">
                  {sections.map(section => (
                    <button key={section} onClick={() => setActiveSection(section)} className={`w-full text-left p-1 text-sm rounded-md ${activeSection === section ? 'text-green-300' : 'text-gray-400'}`}>
                      {section}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="flex items-center gap-2 p-2 bg-red-600 rounded-lg hover:bg-red-700 transition"><LogOut size={18} /> Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{activeYear} / {activeSection}</h2>
            <div className="flex gap-2">
              <button type="button" onClick={downloadExcel} className="px-4 py-2 bg-green-600 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"><FileDown size={16} /> Download Excel</button>
              <button type="button" onClick={downloadPDF} className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"><FileDown size={16} /> Download PDF</button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Roll Number</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Events Participated</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400">Loading students...</td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400">
                      No students found. Total applications fetched: {allApplications.length}
                      <br />
                      <small>Check console for debugging info</small>
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student.roll} className="hover:bg-gray-700">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.roll}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2">{student.events}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1">
          <MessageSystem userRole="student_admin" />
        </div>
      </main>
    </div>
  );
};

export default StudentAdminDashboard;
