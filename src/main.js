import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Moment from 'moment'

import 'amfe-flexible'
import './vant.js'
// import './components.js'
import Common from './common.js'
Vue.use(Common)

import VueI18n from 'vue-i18n'
 
Vue.use(VueI18n) // 通过插件的形式挂载
 
// 引入全部样式
import 'vant/lib/index.less';
import Api from './api/index.js';
import store from './store'
Vue.prototype.$api = Api;
Vue.prototype.moment = Moment;
Vue.config.productionTip = false

// 获取url参数
const getUrlKey = function(name)  {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
const language = getUrlKey('language'); // 语言
store.commit('setLanguage', language);

const i18n = new VueI18n({
    locale: store.state.language  == 'en' ? 'en-US' : 'zh-CN',    // 语言标识
    // locale: 'en-US',    // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
      'zh-CN': require('./assets/js/cn'),   // 中文语言包
      'en-US': require('./assets/js/en')    // 英文语言包
    }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
