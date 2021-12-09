import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    language: 'cn', // en
    indicatorsTree: null
  },
  getters: {
    indicatorsTree: state => {
      if (!state.indicatorsTree) {
        try {
          const list = localStorage.getItem('indicatorsTree')
          state.indicatorsTree = JSON.parse(list)
        } catch (e) {
          console.error(e)
        }
      }
      return state.indicatorsTree
    },
  },
  mutations: {
    setLanguage(state, value) {
      if(value) {
        state.language = value;
        localStorage.setItem('language', value)
      } else {
        let language = localStorage.getItem('language');
        state.language = language;
      }
    }
  },
  actions: {
    
  },
  modules: {
  }
})
