import axios from 'axios';

const api = axios.create({
  baseURL: 'http://app.renegociacao',
});

export default api;
