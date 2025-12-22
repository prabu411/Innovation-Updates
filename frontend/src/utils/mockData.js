// Generates mock data for dashboard charts

export const getMonthlyTrend = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => ({
    name: month,
    "Participation": 50 + Math.floor(Math.random() * 150) + (index * 20),
  }));
};

export const getDepartmentParticipation = () => [
  { name: 'CSE', "Students": 120 + Math.floor(Math.random() * 50) },
  { name: 'ECE', "Students": 90 + Math.floor(Math.random() * 40) },
  { name: 'EEE', "Students": 70 + Math.floor(Math.random() * 30) },
  { name: 'MECH', "Students": 50 + Math.floor(Math.random() * 20) },
  { name: 'IT', "Students": 110 + Math.floor(Math.random() * 45) },
];

export const getEventModeDistribution = () => [
  { name: 'Online', value: 45 },
  { name: 'Offline', value: 30 },
  { name: 'Hybrid', value: 25 },
];

export const getEventCategoryDistribution = () => [
    { name: 'Hackathon', value: 400 },
    { name: 'Workshop', value: 300 },
    { name: 'Competition', value: 200 },
    { name: 'Seminar', value: 100 },
];
