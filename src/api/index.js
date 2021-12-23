import axios from 'axios';
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
// const axios = axios.create({
//   baseURL: 'http://120.27.130.230:8080',
//   // withCredentials: true,
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
//   },
//   timeout: 5000,
// });

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.common['token'] = '123';


axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  //若token存在，则在每次请求头中加入token
  // let token = localStorage.getItem('token');

  // if (token) {
    // config.headers['token'] = token;
  // }

  return config;
  }, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {
  // console.log(response);
  if(response.data) {
    if(response.data.error_code == 400) {
      Toast.fail(response.data.error_desc);
      return false;
    }
    if(response.data.error_code == 404) {
      Toast.fail(response.data.error_desc);
      return false;
    }
    return response.data
  }
  
  
}, function(error) {
	// Do something with response error
	return Promise.reject(error)
})

const baseURL = 'http://120.27.130.230:8080';
Vue.prototype.$serviceUrl = baseURL;

export default {
  get: function (url, params) {
    return axios.get(`${baseURL}${url}`, { params: params }).then(res => res)
  },
  post: function (url, params) {
    return axios.post(`${baseURL}${url}`, params).then(res => res)
  },
  put: function (url, params) {
    return axios.put(`${baseURL}${url}`, params).then(res => res)
  },
  delete: function (url, params) {
    return axios.delete(`${baseURL}${url}`, params).then(res => res)
  }
}