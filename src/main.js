import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/global.css'
import  axios  from "axios";

Vue.config.productionTip = false;
Vue.use(ElementUI);


/* 配置请求根路径 */
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
/* 请求拦截 在头对象添加token验证的au */
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
