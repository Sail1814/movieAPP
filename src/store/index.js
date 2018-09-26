import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id: '123',
    cityValue: '广州',
    tabBarView: true
  },
  getters,
  mutations,
  actions
})
