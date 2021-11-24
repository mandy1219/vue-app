import axios from 'axios';

// const axios = axios.create({
//   baseURL: 'http://120.27.130.230:8080',
//   // withCredentials: true,
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
//   },
//   timeout: 5000,
// });

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  //若token存在，则在每次请求头中加入token
  let token = localStorage.getItem('token');

  if (token) {
    // config.headers['token'] = token;
  }

  return config;
  }, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {
  if (response.data && response.data.code) {
    if (response.data.code == 401) {
        
    }
  }
  if (response.data && response.data.code) {
      if (response.data.code == 400) {
          
      }
  }
  // if (response.data && response.data.code) {
  //   if (parseInt(response.data.code) === 201) {
  //     Message.error(response.data.message);
  //   }
  // }
  return response
}, function(error) {
	// Do something with response error
	return Promise.reject(error)
})

const baseURL = 'http://120.27.130.230:8080';

export default {
  get: function (url, params) {
    return axios.get(`${baseURL}${url}`, params).then(res => res.data)
  },
  post: function (url, params) {
    return axios.post(`${baseURL}${url}`, params).then(res => res.data)
  },
  put: function (url, params) {
    return axios.put(`${baseURL}${url}`, params).then(res => res.data)
  },
  delete: function (url, params) {
    return axios.delete(`${baseURL}${url}`, params).then(res => res.data)
  }
}