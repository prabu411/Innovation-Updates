import React from 'react';
import { Briefcase, Users, Clock, CheckCircle, Plus, FileText, Settings, Activity, BarChart2, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMonthlyTrend, getDepartmentParticipation } from '../utils/mockData';

const KPICard = ({ icon, title, value, change, color, description }) => {
  const Icon = icon;
  return (
    <div className={`p-6 rounded-xl glassmorphism border-l-4 ${color} transition-all hover:shadow-lg hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon size={28} className="text-gray-400" />
          <p className="text-gray-300 font-medium">{title}</p>
        </div>
        <span className={`text-sm font-bold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>{change > 0 ? `+${change}%` : `${change}%`}</span>
      </div>
      <p className="text-4xl font-bold text-white mt-4">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="p-6 rounded-xl glassmorphism border border-gray-800">
    <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  </div>
);

const DashboardOverview = ({ hackathons, students, setActiveView }) => {
  const monthlyData = getMonthlyTrend();
  const deptData = getDepartmentParticipation();

  // Calculate real statistics
  const totalEvents = hackathons.length;
  const totalParticipants = students.length;
  const activeEvents = hackathons.filter(h => new Date(h.dates[0]) > new Date()).length;
  const pendingApprovals = students.filter(s => s.status === 'pending').length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Command Center</h1>
        <p className="text-gray-400">Welcome to the Innovation & Hackathon Management System Dashboard.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard icon={Briefcase} title="Total Events" value={totalEvents} change={12} color="border-cyan-500" description="All-time events conducted" />
        <KPICard icon={Users} title="Total Participants" value={totalParticipants} change={8} color="border-purple-500" description="Unique students engaged" />
        <KPICard icon={Clock} title="Active Events" value={activeEvents} change={-10} color="border-yellow-500" description="Registrations currently open" />
        <KPICard icon={CheckCircle} title="Pending Approvals" value={pendingApprovals} change={25} color="border-red-500" description="OD requests needing review" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Monthly Participation Trend">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
            <Legend />
            <Line type="monotone" dataKey="Participation" stroke="#22d3ee" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Department-wise Participation">
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
            <Legend />
            <Bar dataKey="Students" fill="#a855f7" />
          </BarChart>
        </ChartCard>
      </div>

      {/* Quick Actions & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 p-6 rounded-xl glassmorphism border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => setActiveView('create-hackathon')} className="w-full text-left flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-cyan-600"><Plus /> Create New Event</button>
            <button className="w-full text-left flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-purple-600"><FileText /> Generate OD Letters</button>
            <button className="w-full text-left flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-yellow-600"><Settings /> System Settings</button>
          </div>
        </div>
        <div className="lg:col-span-2 p-6 rounded-xl glassmorphism border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          {students.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {students.slice(0, 3).map((app, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Activity size={16} className="text-green-400" /> 
                  {app.student?.name || 'Student'} applied for <span className="font-semibold text-cyan-400">{app.hackathon?.name || 'Event'}</span>. 
                  <span className="text-gray-500 ml-auto">{new Date(app.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
