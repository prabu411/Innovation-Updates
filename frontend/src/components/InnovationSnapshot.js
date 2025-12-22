import React from 'react';
import { CheckSquare, Calendar, FileCheck } from 'lucide-react';

const SnapshotCard = ({ icon, title, value, color }) => {
  const Icon = icon;
  return (
    <div className={`p-4 rounded-lg flex items-center gap-4 bg-gray-800 border-l-4 ${color}`}>
      <Icon size={24} className="text-white" />
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{title}</p>
      </div>
    </div>
  );
};

const InnovationSnapshot = ({ applications }) => {
  const upcomingEvents = applications.filter(app => app.hackathon?.dates?.[0] && new Date(app.hackathon.dates[0]) > new Date()).length;
  const approvedODs = applications.filter(app => app.status === 'approved').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SnapshotCard icon={CheckSquare} title="Events Participated" value={applications.length} color="border-purple-500" />
      <SnapshotCard icon={Calendar} title="Upcoming Events" value={upcomingEvents} color="border-yellow-500" />
      <SnapshotCard icon={FileCheck} title="Approved OD Requests" value={approvedODs} color="border-green-500" />
    </div>
  );
};

export default InnovationSnapshot;
