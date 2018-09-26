// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './common/sass/index.scss'
import VueLazyLoad from 'vue-lazyload'
import store from './store/index'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(VueAxios, axios)
Vue.use(VueLazyLoad, {
  loading: require('./common/img/loading.gif')
})
Vue.use(MintUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
