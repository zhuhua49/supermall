import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('views/home/Home.vue')
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('views/category/Category.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('views/cart/Cart.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('views/profile/Profile.vue')
  },
  {
    path: '/detail/:iid',
    name: 'detail',
    component: () => import('views/detail/Detail.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
