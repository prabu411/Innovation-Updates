import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { hackathonAPI, applicationAPI, registrationAPI, documentAPI } from '../services/api';
import { LogOut } from 'lucide-react';
import StudentProfileCard from '../components/StudentProfileCard';
import InnovationSnapshot from '../components/InnovationSnapshot';
import MyInnovationJourney from '../components/MyInnovationJourney';
import AvailableEvents from '../components/AvailableEvents';
import MyApplications from '../components/MyApplications';
import DocumentCenter from '../components/DocumentCenter';

const StudentDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [hackathons, setHackathons] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching student dashboard data...');
      
      const [hackathonsRes, applicationsRes] = await Promise.all([
        hackathonAPI.getAll(),
        applicationAPI.getMyApplications()
      ]);
      
      console.log('Hackathons fetched:', hackathonsRes.data);
      console.log('Applications fetched:', applicationsRes.data);
      
      setHackathons(hackathonsRes.data);
      setMyApplications(applicationsRes.data);
      
      // Try to fetch registrations and documents, but don't fail if they error
      try {
        const registrationsRes = await registrationAPI.getMyRegistrations();
        setMyRegistrations(registrationsRes.data);
      } catch (regError) {
        console.warn('Failed to fetch registrations:', regError);
        setMyRegistrations([]);
      }
      
      try {
        const documentsRes = await documentAPI.getODForms();
        setDocuments(documentsRes.data);
      } catch (docError) {
        console.warn('Failed to fetch documents:', docError);
        setDocuments([]);
      }
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Set empty arrays as fallback
      setHackathons([]);
      setMyApplications([]);
      setMyRegistrations([]);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Student Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-md p-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-purple-400">Student Innovation Portal</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition">
          <LogOut size={18} /> Logout
        </button>
      </header>

      <main className="p-4 md:p-8">
        <div className="mb-8">
          <StudentProfileCard />
        </div>
        <div className="mb-8">
          <InnovationSnapshot applications={myApplications} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AvailableEvents hackathons={hackathons} myApplications={myApplications} myRegistrations={myRegistrations} refreshData={fetchData} />
            <MyApplications applications={myApplications} registrations={myRegistrations} />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <DocumentCenter documents={documents} />
            <MyInnovationJourney applications={myApplications} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
