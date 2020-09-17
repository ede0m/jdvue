import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'
import Unicon from 'vue-unicons'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { uniSetting, uniAngleRight } from 'vue-unicons/src/icons'
import App from './App.vue'
import router from './router'

Unicon.add([uniSetting, uniAngleRight])

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Notifications)
Vue.use(Unicon)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
