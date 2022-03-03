import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/users/users'
import Right from '@/components/rights/right'
import Role from '@/components/rights/role'
import Goodslist from '@/components/goods/goodslist'
import Goodsadd from '@/components/goods/goodsadd'
import Goodscate from '@/components/goods/goodscate'
import Cateparams from '@/components/goods/cateparams'
import Order from '@/components/order/order'


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
        {path: '/rights',name: 'Right',component: Right},
        {path: '/roles',name: 'Role',component: Role},
        {path: '/goods',name: 'Goodslist',component: Goodslist},
        {path: '/goodsadd',name: 'Goodsadd',component: Goodsadd},
        {path: '/categories',name: 'Goodscate',component: Goodscate},
        {path: '/params',name: 'Cateparams',component: Cateparams},
        {path: '/orders',name: 'Order',component: Order},

      ]
    }
  ]
})
