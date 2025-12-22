import React from 'react';
import { Zap, Award } from 'lucide-react';

const MyInnovationJourney = ({ applications }) => {
  // Show only real applications
  const journeyItems = applications
    .map(app => ({
      type: 'application',
      date: app.createdAt,
      title: `Participated in ${app.hackathon?.name || 'Event'}`,
      description: `Status: ${app.status}`,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">My Innovation Journey</h2>
      {journeyItems.length === 0 ? (
        <p className="text-gray-400 text-sm">No participation history yet. Apply to hackathons to start your journey!</p>
      ) : (
        <div className="space-y-6 border-l-2 border-gray-700 ml-3">
          {journeyItems.map((item, index) => (
            <div key={index} className="relative pl-8">
              <div className="absolute -left-3.5 top-1 w-5 h-5 rounded-full bg-purple-500">
                <Zap size={12} className="text-white m-auto mt-1" />
              </div>
              <p className="text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
              <h4 className="font-semibold text-white">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInnovationJourney;
