import React, { useState, useEffect } from 'react';
import { hackathonAPI, applicationAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardOverview from '../components/DashboardOverview';
import HackathonManager from '../components/HackathonManager';
import StudentManager from '../components/StudentManager';
import ReportsManager from '../components/ReportsManager';
import IICManager from '../components/IICManager';
import TheoryContext from '../components/TheoryContext';
import AdminPanel from '../components/AdminPanel';

const CoordinatorDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [hackathons, setHackathons] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchHackathons();
    fetchInitialStudents();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchInitialStudents();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchHackathons = async () => {
    try {
      const { data } = await hackathonAPI.getAll();
      setHackathons(data);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  };

  const fetchInitialStudents = async () => {
    try {
      // Try to get all applications first, fallback to participated students
      const { data } = await applicationAPI.getAllApplications();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching applications, trying participated students:', error);
      try {
        const { data } = await hackathonAPI.getParticipatedStudents({});
        setStudents(data);
      } catch (fallbackError) {
        console.error('Error fetching students:', fallbackError);
      }
    }
  };

  const handleModalClose = () => {
    if (activeView === 'create-hackathon') {
      setActiveView('manage-hackathons');
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview hackathons={hackathons} students={students} setActiveView={setActiveView} />;
      case 'manage-hackathons':
        return <HackathonManager hackathons={hackathons} fetchHackathons={fetchHackathons} refreshStudents={fetchInitialStudents} onClose={handleModalClose} />;
      case 'create-hackathon':
        return <HackathonManager hackathons={hackathons} fetchHackathons={fetchHackathons} refreshStudents={fetchInitialStudents} shouldOpenCreateModal={true} onClose={handleModalClose} />;
      case 'applied-students':
        return (
          <div>
            <AdminPanel />
            <StudentManager hackathons={hackathons} />
          </div>
        );
      case 'iic-activities':
        return <IICManager />;
      case 'reports':
        return <ReportsManager hackathons={hackathons} students={students} />;
      case 'theory-context':
        return <TheoryContext />;
      default:
        return <DashboardOverview hackathons={hackathons} students={students} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 flex flex-col">
        <Topbar pageTitle={activeView} />
        <div className="flex-grow overflow-y-auto">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default CoordinatorDashboard;
