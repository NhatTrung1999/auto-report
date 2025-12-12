import axios from 'axios';
import apiConfig from './apiConfig';

const axiosConfig = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosConfig;
