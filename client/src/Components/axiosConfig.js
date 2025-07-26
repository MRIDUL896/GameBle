import axios from 'axios';

//const backend = process.env.BACKENDURL ? process.env.BACKENDURL : "http://localhost:8000";
const api = axios.create({
  baseURL: "https://gameable.onrender.com",
  withCredentials: true // This is important for sending cookies with requests
});

export default api;