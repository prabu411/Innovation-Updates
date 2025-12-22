import React from 'react';
import { LayoutDashboard, PlusCircle, List, Users, FileDown, Lightbulb, Info } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Create Hackathon', icon: PlusCircle },
    { name: 'Manage Hackathons', icon: List },
    { name: 'Applied Students', icon: Users },
    { name: 'IIC Activities', icon: Lightbulb },
    { name: 'Reports', icon: FileDown },
    { name: 'Theory & Context', icon: Info },
  ];

  const handleViewChange = (viewName) => {
    setActiveView(viewName.toLowerCase().replace(/\s+/g, '-'));
  };

  return (
    <aside className="w-64 bg-gray-900 h-screen flex flex-col border-r border-gray-800">
      <div className="p-6 text-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          Innovation Center
        </h1>
        <p className="text-xs text-cyan-400 font-semibold mt-1">Sri Eshwar College of Engineering</p>
      </div>
      <nav className="flex-grow py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="px-3 py-1">
              <button
                onClick={() => handleViewChange(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === item.name.toLowerCase().replace(/\s+/g, '-')
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg neon-glow'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-600 text-center">
          Ecosystem v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
