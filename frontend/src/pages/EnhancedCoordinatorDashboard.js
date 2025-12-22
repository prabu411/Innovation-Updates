import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  LayoutDashboard, Users, Calendar, FileText, Download, 
  Settings, LogOut, TrendingUp, Award, Bell, Search,
  Plus, Filter, BarChart3, PieChart, Activity
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import ParticipantTracker from '../components/ParticipantTracker';

const EnhancedCoordinatorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [hackathons, setHackathons] = useState([]);
  const [applications, setApplications] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [hackRes, appRes, regRes] = await Promise.all([
        API.get('/hackathons'),
        API.get('/applications'),
        API.get('/registrations')
      ]);
      setHackathons(hackRes.data);
      setApplications(appRes.data);
      setRegistrations(regRes.data);
      calculateStats(hackRes.data, appRes.data, regRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (hacks, apps, regs = []) => {
    const studentIds = new Set();
    apps.forEach(a => { if (a.student) studentIds.add(a.student._id || a.student); });
    regs.forEach(r => { if (r.user) studentIds.add(r.user._id || r.user); });

    setStats({
      totalEvents: hacks.length,
      activeEvents: hacks.filter(h => new Date(h.dates[0]) > new Date()).length,
      totalParticipants: studentIds.size,
      pendingApprovals: apps.filter(a => a.status === 'pending').length
    });
  };

  const exportToExcel = () => {
    const combined = [
      ...applications.map(app => ({
        Type: 'Application',
        Student: app.student?.name,
        Email: app.student?.email,
        Event: app.hackathon?.name,
        Status: app.status,
        Date: new Date(app.createdAt).toLocaleDateString()
      })),
      ...registrations.map(reg => ({
        Type: 'Registration',
        Student: reg.user?.name,
        Email: reg.user?.email,
        Event: reg.hackathon?.name,
        Status: 'registered',
        Date: new Date(reg.registrationDate || reg.createdAt).toLocaleDateString()
      }))
    ];
    const ws = XLSX.utils.json_to_sheet(combined);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications_and_Registrations');
    XLSX.writeFile(wb, `Innovation_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const generateODLetter = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('ON-DUTY REQUEST', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('To: Head of Department', 20, 40);
    doc.text('From: Innovation Coordinator', 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text('Subject: Permission for students to attend innovation event', 20, 70);
    
    const studentRows = [];
    applications.forEach(a => {
      if (a.student) studentRows.push([a.student.name, a.student.rollNumber]);
    });
    registrations.forEach(r => {
      if (r.user) studentRows.push([r.user.name, r.user.rollNumber]);
    });

    const uniqueStudents = Array.from(new Map(studentRows.map(s => [s[1], s])).values());

    doc.autoTable({
      startY: 90,
      head: [['Student Name', 'Roll Number']],
      body: uniqueStudents,
      theme: 'grid'
    });
    
    doc.save(`OD_Letter_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800/50 backdrop-blur-md border-r border-gray-700 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white">Innovation Hub</h2>
          <p className="text-sm text-gray-400">Coordinator Portal</p>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'events', icon: Calendar, label: 'Events' },
            { id: 'students', icon: Users, label: 'Students' },
            { id: 'reports', icon: BarChart3, label: 'Reports' },
            { id: 'documents', icon: FileText, label: 'Documents' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={logout} className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}</h1>
            <p className="text-gray-400">Innovation Coordinator Dashboard</p>
          </div>
          <div className="flex gap-4">
            <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
              <Download size={18} />
              Export Excel
            </button>
            <button onClick={generateODLetter} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              <FileText size={18} />
              Generate OD
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                <Calendar size={32} className="mb-2" />
                <h3 className="text-3xl font-bold">{stats.totalEvents}</h3>
                <p className="text-purple-100">Total Events</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl p-6 text-white">
                <Activity size={32} className="mb-2" />
                <h3 className="text-3xl font-bold">{stats.activeEvents}</h3>
                <p className="text-cyan-100">Active Events</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-6 text-white">
                <Users size={32} className="mb-2" />
                <h3 className="text-3xl font-bold">{stats.totalParticipants}</h3>
                <p className="text-green-100">Participants</p>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white">
                <Bell size={32} className="mb-2" />
                <h3 className="text-3xl font-bold">{stats.pendingApprovals}</h3>
                <p className="text-orange-100">Pending</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Recent Applications</h2>
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => (
                  <div key={app._id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">{app.student?.name}</p>
                      <p className="text-sm text-gray-400">{app.hackathon?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recent Registrations */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Registrations</h3>
                <div className="space-y-3">
                  {registrations.slice(0,5).map(reg => (
                    <div key={reg._id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{reg.user?.name}</p>
                        <p className="text-sm text-gray-400">{reg.hackathon?.name}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">registered</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Events</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition">
                <Plus size={18} />
                Create Event
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {hackathons.map(hack => {
                // calculate total applicants for this hackathon (applications + registrations unique by student)
                const appsForHack = applications.filter(a => a.hackathon?._id === hack._id);
                const regsForHack = registrations.filter(r => r.hackathon?._id === hack._id);
                const studentSet = new Set();
                appsForHack.forEach(a => studentSet.add(a.student?._id || a.student));
                regsForHack.forEach(r => studentSet.add(r.user?._id || r.user));
                const totalApplied = studentSet.size;

                return (
                  <div key={hack._id} className="bg-gray-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{hack.name}</h3>
                      <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-sm">{totalApplied} applied</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{hack.description}</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">{hack.mode}</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                        {new Date(hack.dates[0]).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <ParticipantTracker hackathons={hackathons} />
          </div>
        )}
      </main>
    </div>
  );
};

export default EnhancedCoordinatorDashboard;
