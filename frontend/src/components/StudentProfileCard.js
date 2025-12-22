import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const StudentProfileCard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <UserCircle size={48} className="text-purple-400" />
        <div>
          <h3 className="text-xl font-bold text-white">{user?.name}</h3>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <p><strong>Roll Number:</strong> {user?.rollNumber || 'N/A'}</p>
        <p><strong>Department:</strong> {user?.department || 'CSE'}</p>
        <p><strong>Year & Section:</strong> {user?.year} Year - Section {user?.section}</p>
      </div>
    </div>
  );
};

export default StudentProfileCard;
