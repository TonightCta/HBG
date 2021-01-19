import axios from 'axios';
import store from '@/store';
import qs from 'qs'; // fromData 转 string

let ApiVersion = '/api'; // 默认请求地址
const https = axios.create({
  baseURL: ApiVersion,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

https.defaults.transformRequest = [(data, header) => { // 开始请求前期
  header.account = store.state.app.account.name || '';
  header.language = store.state.app.language || 'en';

  if (!header['Content-Type']) {
    return qs.stringify(data);
  }
  return JSON.stringify(data);
}];

https.interceptors.request.use((config) => { // 请求前期后
  return config;
}, error => Promise.reject(error));

https.interceptors.response.use((response) => { // 请求后
  const res = response.data;
  return res; // eslint-disable-line
}, (error) => {
  console.log(error); // eslint-disable-line
  return false;
});

export default https;