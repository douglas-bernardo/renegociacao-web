/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import jwt from 'jsonwebtoken';

const api = axios.create({
  baseURL: 'http://app.renegociacao',
});

api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('@Renegociacao:token');
    if (token && jwt.decode(token)) {
      const decoded: any = jwt.decode(token);
      const expired: boolean = Date.now() > decoded.exp * 1000;
      if (expired) {
        console.log(`token expired: ${expired}`);
        localStorage.removeItem('@Renegociacao:token');
        localStorage.removeItem('@Renegociacao:user');
        localStorage.setItem('@Renegociacao:expired', 'session expired');
        window.location.pathname = '/';
      }
    }
    return config;
  },
  err => {
    console.log('error in getting ', err);
  },
);

export default api;
