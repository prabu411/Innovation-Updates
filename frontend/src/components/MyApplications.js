import React from 'react';

const MyApplications = ({ applications = [], registrations = [] }) => {
  console.log('MyApplications - applications:', applications);
  console.log('MyApplications - registrations:', registrations);
  
  // Merge applications and registrations for display. Prefer internal application status where present.
  const appsByHackathon = new Map(applications.map(a => [a.hackathon?._id, a]).filter(([id]) => id));
  const combined = [...applications];
  registrations.forEach(reg => {
    if (reg.hackathon?._id && !appsByHackathon.has(reg.hackathon._id)) {
      combined.push({
        _id: reg._id,
        hackathon: reg.hackathon,
        createdAt: reg.registrationDate || reg.createdAt,
        status: 'registered'
      });
    }
  });

  if (combined.length === 0) {
    return (
      <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">My Applications & Status Tracker</h2>
        <div className="text-center py-8">
          <p className="text-gray-400">No applications found</p>
          <p className="text-gray-500 text-sm mt-2">Apply to hackathons to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">My Applications & Status Tracker</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 text-left text-gray-400">Event Name</th>
              <th className="p-2 text-left text-gray-400">Application Date</th>
              <th className="p-2 text-left text-gray-400">Event Date</th>
              <th className="p-2 text-left text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {combined.map(app => (
              <tr key={app._id} className="hover:bg-gray-700/50">
                <td className="p-3">{app.hackathon?.name || 'Unknown Event'}</td>
                <td className="p-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{app.hackathon?.dates?.[0] ? new Date(app.hackathon.dates[0]).toLocaleDateString() : 'TBD'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    app.status === 'approved' ? 'bg-green-900 text-green-200' :
                    app.status === 'rejected' ? 'bg-red-900 text-red-200' :
                    app.status === 'registered' ? 'bg-blue-900 text-blue-200' :
                    'bg-yellow-900 text-yellow-200'
                  }`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApplications;
