import React from 'react';
import { Lightbulb } from 'lucide-react';

const IICManager = () => {
  const iicEvents = [
    { id: 1, title: 'Workshop on Design Thinking', date: '2024-09-15', type: 'Workshop' },
    { id: 2, title: 'Expert Talk: The Future of AI', date: '2024-10-02', type: 'Seminar' },
    { id: 3, title: 'Ideation Challenge Kick-off', date: '2024-10-10', type: 'Challenge' },
  ];

  return (
    <div className="p-8">
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Institution's Innovation Council (IIC) Activities</h2>
        <p className="text-gray-600 mt-2">
          This section tracks activities aligned with the Ministry of Education (MoE) Innovation Cell goals, fostering a structured innovation culture.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Scheduled IIC Events</h3>
        <div className="space-y-4">
          {iicEvents.map(event => (
            <div key={event.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">{event.title}</p>
                <p className="text-sm text-gray-600">Date: {event.date}</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IICManager;
