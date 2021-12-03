import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Moment from 'moment'

import 'amfe-flexible'
import './vant.js'
// import './components.js'

// 引入全部样式
import 'vant/lib/index.less';
import Api from './api/index.js';
import store from './store'
Vue.prototype.$api = Api;
Vue.prototype.moment = Moment;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
