import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
// store pinia
import {useUserStore} from '../store/user'

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () =>import("../views/About.vue"),
  },
  {
    path: "/course",
    name: "Course",
    component: () =>import("../views/Course.vue"),
  },
  {
    path: "/course/detail",
    name: "Detail",
    component: () =>import("../views/Detail.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>import("../views/Login.vue"),
  },
  { 
    path:'/course-play/:courseId/:chapterId',
    name:'course-play',
    component: () =>import("../views/CoursePlay.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () =>import("../views/Cart.vue"),
    beforeEnter: (to, from, next) => {
      // 判断用户是否登录，也就是是否有用户id
      if(useUserStore().userInfo.id){
        next()
      }else{
        next('/login')
      }
    }
  },
  {
    path: "/confirmOrder",
    name: "ConfirmOrder",
    component: () =>import("../views/ConfirmOrder.vue"),
    beforeEnter: (to, from, next) => {
      // 判断用户是否登录，也就是是否有用户id
      if(useUserStore().userInfo.id){
        next()
      }else{
        next('/login')
      }
    }
  },
  {
    path: "/personal",
    name: "Personal",
    component: () =>import("../views/Personal.vue"),
    beforeEnter: (to, from, next) => {
      // 判断用户是否登录，也就是是否有用户id
      if(useUserStore().userInfo.id){
        next()
      }else{
        next('/login')
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;