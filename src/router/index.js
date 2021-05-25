import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/top',
    name: 'Top',
    component: () => import('../views/Top.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('../views/Ranking.vue')
  },
  {
    path: '/mypage',
    name: 'Mypage',
    component: () => import('../views/Mypage.vue')
  },
  {
    path: '/userpage',
    name: 'Userpage',
    component: () => import('../views/Userpage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
