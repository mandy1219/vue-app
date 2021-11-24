import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './vant.js'
// 引入全部样式
import 'vant/lib/index.less';
import Api from './api/index.js';
Vue.prototype.$api = Api;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
