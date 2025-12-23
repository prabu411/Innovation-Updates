import React, { useState, useEffect } from 'react';
import { hackathonAPI, applicationAPI } from '../services/api';
import { Edit, Trash2, Plus, UploadCloud, Users, Eye, EyeOff, RefreshCw } from 'lucide-react';

// Define Form Components OUTSIDE the main component to prevent re-rendering on state change
const FormInput = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>
    <input {...props} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white placeholder-gray-500" />
  </div>
);

const FormSelect = ({ label, children, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>
    <select {...props} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white">
      {children}
    </select>
  </div>
);

const FormTextarea = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>
    <textarea {...props} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white placeholder-gray-500" />
  </div>
);

const HackathonManager = ({ hackathons, fetchHackathons, refreshStudents, shouldOpenCreateModal, onClose }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [expandedHackathon, setExpandedHackathon] = useState(null);
  const [formData, setFormData] = useState({
    name: '', organizer: '', dates: '', mode: 'online', description: '',
    location: '', prizePool: '', themes: '', registrationLink: '', collegeDBLink: '',
    eligibleDepartments: '', eligibility: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [posterFile, setPosterFile] = useState(null);

  useEffect(() => {
    if (shouldOpenCreateModal) {
      handleCreateClick();
    }
    fetchApplications();
  }, [shouldOpenCreateModal, hackathons]); // Add hackathons as dependency

  const fetchApplications = async () => {
    try {
      console.log('HackathonManager: Fetching applications using existing API...');
      const { data } = await applicationAPI.getAllApplications();
      console.log('HackathonManager: Applications fetched:', data.length);
      console.log('HackathonManager: Sample application:', data[0]);
      setApplications(data);
      
      if (refreshStudents) {
        refreshStudents();
      }
    } catch (error) {
      console.error('HackathonManager: Error fetching applications:', error);
      setApplications([]);
    }
  };

  const getStudentCount = (hackathonId) => {
    const count = applications.filter(app => app.hackathon?._id === hackathonId).length;
    console.log(`Student count for hackathon ${hackathonId}:`, count);
    return count;
  };

  const getStudentsForHackathon = (hackathonId) => {
    const students = applications.filter(app => app.hackathon?._id === hackathonId && app.student);
    console.log(`Students for hackathon ${hackathonId}:`, students);
    return students;
  };

  const toggleStudentDetails = (hackathonId) => {
    setExpandedHackathon(expandedHackathon === hackathonId ? null : hackathonId);
  };

  const handleCreateClick = () => {
    resetFormState(); // Only reset data, don't close yet
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'dates' || key === 'themes' || key === 'eligibleDepartments') {
        formDataToSend.append(key, JSON.stringify(formData[key].split(',').map(d => d.trim())));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    if (posterFile) {
      formDataToSend.append('poster', posterFile);
    }

    try {
      if (editingId) {
        await hackathonAPI.update(editingId, formDataToSend);
      } else {
        await hackathonAPI.create(formDataToSend);
      }
      fetchHackathons();
      fetchApplications(); // Refresh applications data
      handleClose();
    } catch (error) {
      console.error('Error saving hackathon:', error);
      // Show the specific error message from the backend
      alert(`Failed to save hackathon: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This action is irreversible.')) {
      try {
        await hackathonAPI.delete(id);
        fetchHackathons();
      } catch (error) {
        console.error('Error deleting hackathon:', error);
      }
    }
  };

  const handleEdit = (hackathon) => {
    setFormData({
      name: hackathon.name,
      organizer: hackathon.organizer || '',
      dates: hackathon.dates.map(d => new Date(d).toISOString().split('T')[0]).join(', '),
      mode: hackathon.mode,
      description: hackathon.description,
      location: hackathon.location || '',
      prizePool: hackathon.prizePool || '',
      themes: hackathon.themes.join(', '),
      registrationLink: hackathon.registrationLink,
      collegeDBLink: hackathon.collegeDBLink || '',
      eligibleDepartments: (hackathon.eligibleDepartments || []).join(', '),
      eligibility: hackathon.eligibility || ''
    });
    setEditingId(hackathon._id);
    setShowCreateModal(true);
  };

  const resetFormState = () => {
    setFormData({
      name: '', organizer: '', dates: '', mode: 'online', description: '',
      location: '', prizePool: '', themes: '', registrationLink: '', collegeDBLink: ''
    });
    setPosterFile(null);
    setEditingId(null);
  };

  const handleClose = () => {
    resetFormState();
    setShowCreateModal(false);
    if (onClose) onClose();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Hackathons</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchApplications}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            <RefreshCw size={18} />
            Refresh Data
          </button>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition"
          >
            <Plus size={20} />
            Create New Hackathon
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hackathons.map((hackathon) => {
          const studentCount = getStudentCount(hackathon._id);
          const students = getStudentsForHackathon(hackathon._id);
          const isExpanded = expandedHackathon === hackathon._id;
          
          return (
            <div key={hackathon._id} className="glassmorphism rounded-xl overflow-hidden group transition-all hover:border-cyan-500 border border-gray-800">
              {hackathon.poster && <img src={`${process.env.NODE_ENV === 'production' ? 'https://innovation-updates.onrender.com' : 'http://localhost:5003'}/${hackathon.poster}`} alt={hackathon.name} className="w-full h-40 object-cover" />}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{hackathon.name}</h3>
                <p className="text-gray-400 text-sm mb-3">by {hackathon.organizer}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    hackathon.mode === 'online' ? 'bg-blue-800 text-blue-300' : 'bg-green-800 text-green-300'
                  }`}>
                    {hackathon.mode.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-800 text-purple-300 flex items-center gap-1">
                    <Users size={12} /> {studentCount} Applied
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{hackathon.description}</p>
                
                {studentCount > 0 && (
                  <button 
                    onClick={() => toggleStudentDetails(hackathon._id)}
                    className="w-full mb-4 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 text-cyan-400 rounded-lg hover:bg-gray-700 transition"
                  >
                    {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                    {isExpanded ? 'Hide' : 'View'} Student Details
                  </button>
                )}
                
                {isExpanded && students.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-800/50 rounded-lg max-h-40 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-white mb-2">Applied Students:</h4>
                    <div className="space-y-1">
                      {students.map((app) => (
                        <div key={app._id} className="text-xs text-gray-300 flex justify-between">
                          <span>{app.student?.name || 'Unknown'}</span>
                          <span className="text-gray-500">{app.student?.rollNumber || 'N/A'} | {app.student?.department || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(hackathon)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-cyan-600">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(hackathon._id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-red-600">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="glassmorphism rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-white neon-text">{editingId ? 'Edit' : 'Create'} Hackathon</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput label="Hackathon Name *" type="text" placeholder="e.g., Smart India Hackathon" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <FormInput label="Organizer" type="text" placeholder="e.g., Ministry of Education" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} />
              <FormInput label="Dates (YYYY-MM-DD, comma-separated)" type="text" placeholder="e.g., 2024-12-01, 2024-12-02" required value={formData.dates} onChange={(e) => setFormData({ ...formData, dates: e.target.value })} />
              <FormSelect label="Mode" value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </FormSelect>
              <FormTextarea label="Description *" placeholder="Describe the hackathon..." required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Location" type="text" placeholder="e.g., New Delhi" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                <FormInput label="Prize Pool" type="text" placeholder="e.g., ₹1,00,000" value={formData.prizePool} onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })} />
              </div>
              <FormInput label="Themes (comma-separated)" type="text" placeholder="e.g., AI, Blockchain, IoT" value={formData.themes} onChange={(e) => setFormData({ ...formData, themes: e.target.value })} />
              <FormInput label="Registration Link *" type="url" placeholder="https://example.com/register" required value={formData.registrationLink} onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })} />
              <FormInput label="Eligible Departments (comma-separated)" type="text" placeholder="e.g., CSE, ECE, ME" value={formData.eligibleDepartments} onChange={(e) => setFormData({ ...formData, eligibleDepartments: e.target.value })} />
              <FormTextarea label="Eligibility Note (optional)" placeholder="e.g., Only open to 3rd and 4th year students" rows="2" value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })} />
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">Poster Upload</label>
                <div className="relative w-full px-4 py-3 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl text-center cursor-pointer hover:border-cyan-500">
                  <UploadCloud className="mx-auto text-gray-500" />
                  <p className="text-sm text-gray-400 mt-2">{posterFile ? posterFile.name : 'Click to upload a file'}</p>
                  <input type="file" accept="image/*" className="opacity-0 absolute inset-0 cursor-pointer" onChange={(e) => setPosterFile(e.target.files[0])} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition">{editingId ? 'Update Hackathon' : 'Create Hackathon'}</button>
                <button type="button" onClick={handleClose} className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonManager;
