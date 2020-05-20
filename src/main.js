// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

import 'common/stylus/index.styl';
// import router from './router'
/* eslint-disable no-new */
Vue.use(VueRouter)
Vue.use(VueResource)


//router map for routings
var router = new VueRouter({
  // linkActiveClass: 'active',
  // linkExactActiveClass: 'exact-active',
  routes: [
    {path: '/goods', component: goods},
    {path: '/ratings', component: ratings},
    {path: '/seller', component: seller}
  ]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
