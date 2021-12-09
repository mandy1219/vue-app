import Vue from 'vue';
import router from './router'

export default {
    install (Vue, options) {
        // 路由回退
        Vue.prototype.$back = function() {
            router.go(-1);
        },
        // 获取url参数
        Vue.prototype.$getUrlKey = function() {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }
    },
}