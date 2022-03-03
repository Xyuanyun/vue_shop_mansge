// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
// myBread是引入组件选项的对象{template:'',data(){return{}},props:[]}
import myBread from '@/components/cuscom/myBread'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/reset.css';
import MyServerHttp from '@/plugins/http.js'
// import { HotModuleReplacementPlugin } from 'webpack'
import moment from 'moment'

// 之前axios用法
// import axios from 'axios'
// Vue.prototype.$http=axios

Vue.config.productionTip = false
//适用vue插件
Vue.use(ElementUI);
// axios本身不是插件，用插件的方法去导入
Vue.use(MyServerHttp);

//全局日期时间过滤器 
Vue.filter('fmtdata',(v)=>{
  return moment(v).format('YYYY-MM-DD')
})

// 导入全局组件
// Vue.component('my-bread',{
//   template:'',
//   data(){return{}},
//   props:[]
// })
Vue.component(myBread.name,myBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // render(h)=>h(App)
  components: { App },
  template: '<App/>'
})
