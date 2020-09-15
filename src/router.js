import Vue from 'vue'
import Router from 'vue-router'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';

Vue.use(Router)

const routes = [
    { path: '/', component: Login },
    { path: '/register', component: Register }
]

const router = new Router({
    routes : routes 
})

router.beforeResolve((to, from, next) => {
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start()
    }
    next()
})

// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
    // Complete the animation of the route progress bar.
    NProgress.done()
})
  

// export the router instance
export default router