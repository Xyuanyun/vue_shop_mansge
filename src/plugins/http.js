// axios插件模块
// 在main.js中用插件方法进行导入，导入后在其他文件中使用this.$http.get()发送axios请求

import axios from 'axios'

const MyHttpServer={}
MyHttpServer.install = (Vue)=> {
    axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
      // 在发送请求之前做些什么
      if(config.url!=='login'){
        const AUTH_TOKEN=localStorage.getItem('token')
        config.headers['Authorization'] = AUTH_TOKEN
      }
      
      return config;
      // 请求头中Authorization设置
     
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });
  
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      return response;
    }, function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    });
  
    // 4. 添加实例方法
    Vue.prototype.$http=axios
  }

  export default MyHttpServer
