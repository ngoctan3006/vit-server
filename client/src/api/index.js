import axios from 'axios';
import { PROFILE } from '../constants/localStorageItemName';

const API = axios.create({
  baseURL:
    process.env.NODE_ENV !== 'production'
      ? 'http://localhost:2109/api/v1'
      : 'https://vit-api-server.herokuapp.com/api/v1'
});

API.interceptors.request.use((req) => {
  if (localStorage[PROFILE]) {
    req.headers['Authorization'] = `Bearer ${
      JSON.parse(localStorage[PROFILE]).token
    }`;
  }
  return req;
});

export const loadUser = () => API.get('/users/auth');
export const login = (userInfo) => API.post('/users/login', userInfo);
export const getAllUsers = () => API.get('/users');
