import React, { useState, useContext } from 'react';
import { Calendar, MapPin, Award, ExternalLink, CheckCircle } from 'lucide-react';
import { applicationAPI, registrationAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AvailableEvents = ({ hackathons, myApplications, myRegistrations = [], refreshData }) => {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const isApplied = (hackathonId) => {
    console.log('Checking if applied to hackathon:', hackathonId);
    console.log('My applications:', myApplications);
    console.log('My registrations:', myRegistrations);
    
    const hasApplication = myApplications.some(app => {
      console.log('Checking app:', app.hackathon?._id, 'vs', hackathonId);
      return app.hackathon?._id === hackathonId;
    });
    const hasRegistration = myRegistrations.some(reg => {
      console.log('Checking reg:', reg.hackathon?._id, 'vs', hackathonId);
      return reg.hackathon?._id === hackathonId;
    });
    
    console.log('Has application:', hasApplication, 'Has registration:', hasRegistration);
    return hasApplication || hasRegistration;
  };

  const isEligible = (hackathon) => {
    if (!hackathon.eligibleDepartments || hackathon.eligibleDepartments.length === 0) return true; // open to all
    if (!user) return true; // unknown user, assume visible but not decision-making here
    return hackathon.eligibleDepartments.includes(user.department) || hackathon.eligibleDepartments.includes(user.department?.toUpperCase());
  };

  const handleApply = async (hackathonId) => {
    try {
      await applicationAPI.apply(hackathonId);
      alert('Application submitted successfully!');
      refreshData();
    } catch (error) {
      alert(error.response?.data?.message || 'Application failed');
    }
  };

  const handleRegister = async (hackathon) => {
    try {
      // Create a registration record before opening external link
      await registrationAPI.register(hackathon._id);
      // open external registration link in new tab
      window.open(hackathon.registrationLink, '_blank');
      refreshData();
    } catch (error) {
      // If duplicate or other error, still open the link
      window.open(hackathon.registrationLink, '_blank');
      alert(error.response?.data?.message || 'Registration recorded / link opened');
      refreshData();
    }
  };

  const filteredEvents = hackathons.filter(h => {
    // Mode filter
    if (filter === 'online' && h.mode !== 'online') return false;
    if (filter === 'offline' && h.mode !== 'offline') return false;
    
    // Department filter
    if (departmentFilter === 'eligible') {
      // Show only hackathons eligible for user's department
      if (!isEligible(h)) return false;
    } else if (departmentFilter === 'my-dept' && user?.department) {
      // Show only hackathons specifically for user's department
      if (!h.eligibleDepartments || !h.eligibleDepartments.includes(user.department)) return false;
    }
    
    return true;
  });

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Available Hackathons & Events</h2>
        <div className="flex gap-3">
          <select 
            className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <select 
            className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="eligible">Eligible for Me</option>
            <option value="my-dept">My Department Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg mb-2">No hackathons available</p>
            <p className="text-gray-500 text-sm">Check back later for new events!</p>
          </div>
        ) : (
          filteredEvents.map((hackathon) => (
            <div key={hackathon._id} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              {hackathon.poster && (
                <img src={`${process.env.NODE_ENV === 'production' ? 'https://innovation-updates.onrender.com' : 'http://localhost:5003'}/${hackathon.poster}`} alt={hackathon.name} className="w-full h-32 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2">{hackathon.name}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    hackathon.mode === 'online' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'
                  }`}>
                    {hackathon.mode.toUpperCase()}
                  </span>
                  {hackathon.themes && hackathon.themes.slice(0, 2).map((theme, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-600 text-gray-300 rounded text-xs">
                      {theme}
                    </span>
                  ))}
                  {hackathon.eligibleDepartments && hackathon.eligibleDepartments.length > 0 && (
                    <div className="ml-2 flex items-center gap-2">
                      {hackathon.eligibleDepartments.slice(0,3).map((dept, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-800 text-indigo-200 rounded text-xs">{dept}</span>
                      ))}
                      {hackathon.eligibleDepartments.length > 3 && (
                        <span className="px-2 py-0.5 bg-indigo-900 text-indigo-200 rounded text-xs">+{hackathon.eligibleDepartments.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                
                {hackathon.description && (
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{hackathon.description}</p>
                )}
                
                <div className="space-y-1 text-sm text-gray-300 mb-3">
                  <div className="flex items-center gap-2"><Calendar size={14} /> <strong>Date:</strong> {hackathon.dates && hackathon.dates[0] ? new Date(hackathon.dates[0]).toLocaleDateString() : 'TBD'}</div>
                  {hackathon.location && <div className="flex items-center gap-2"><MapPin size={14} /> <strong>Location:</strong> {hackathon.location}</div>}
                  {hackathon.prizePool && <div className="flex items-center gap-2"><Award size={14} /> <strong>Prize:</strong> {hackathon.prizePool}</div>}
                  {hackathon.organizer && <div className="text-gray-400 text-xs"><strong>By:</strong> {hackathon.organizer}</div>}
                </div>

                {hackathon.registrationLink && (
                  <div className="mb-3 p-2 bg-gray-600 rounded text-xs">
                    <p className="text-gray-300 mb-1">Registration:</p>
                    <a href={hackathon.registrationLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 break-all underline">
                      {hackathon.registrationLink}
                    </a>
                  </div>
                )}

                <div className="flex gap-2">
                  {isApplied(hackathon._id) ? (
                    <button disabled className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-800 text-green-200 rounded-lg text-sm font-semibold cursor-default">
                      <CheckCircle size={16} /> Applied
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleApply(hackathon._id)} disabled={!isEligible(hackathon)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition ${isEligible(hackathon) ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                        Submit Application
                      </button>
                      {hackathon.registrationLink && (
                        <button onClick={() => handleRegister(hackathon)} className="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 flex items-center gap-1">
                          <ExternalLink size={16} /> Register
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableEvents;
