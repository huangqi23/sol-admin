import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
// 引入icon
import './assets/icon/iconfont.css'
import  has from './directive/permission/button/index.js'

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
