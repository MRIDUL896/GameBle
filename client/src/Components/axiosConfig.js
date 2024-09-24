import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gameable.onrender.com',
  withCredentials: true // This is important for sending cookies with requests
});

export default api;