import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/Home.vue"
import Welcome from "../components/Welcome.vue";
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Report from '../components/report/Report.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: '/login'
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path:"/home",   
    name:'home',
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path:"/welcome",
        name:'welcome',
        component: Welcome,
      },
      {
        path:"/users",
        name:'users',
        component:Users ,
      },
      {
        path:"/rights",
        name:'rights',
        component:Rights ,
      },
      {
        path:"/roles",
        name:'roles',
        component:Roles ,
      },
      {
        path:"/reports",
        name:'report',
        component:Report,
      }      
    ]
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login')
    return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router;
