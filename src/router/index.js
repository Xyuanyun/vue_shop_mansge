import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/users/users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      // 在home中所用到的组件
      children:[
        {path: '/users',name: 'Users',component: Users},
        
      ]
    }
  ]
})
