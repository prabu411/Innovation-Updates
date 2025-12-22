import axios from 'axios';

// Use production API URL for deployment
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://innovation-updates.onrender.com'
  : process.env.REACT_APP_API_ORIGIN || 'http://localhost:5003';

const API = axios.create({
  baseURL: `${API_URL}/api`
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const hackathonAPI = {
  getAll: () => API.get('/hackathons'),
  getById: (id) => API.get(`/hackathons/${id}`),
  create: (formData) => API.post('/hackathons', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/hackathons/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/hackathons/${id}`),
  getParticipatedStudents: (params) => API.get('/hackathons/participated-students', { params })
};

export const applicationAPI = {
  apply: (hackathonId) => API.post('/applications', { hackathonId }),
  getMyApplications: () => API.get('/applications/my-applications'),
  getAllApplications: () => API.get('/applications')
};

export const registrationAPI = {
  register: (hackathonId) => API.post('/registrations', { hackathon: hackathonId }),
  getMyRegistrations: () => API.get('/registrations')
};

export const documentAPI = {
  getODForms: () => API.get('/documents', { params: { type: 'od_form' } })
};

export default API;
