// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import Vant from 'vant';

// import store from './store'

import 'vant/lib/index.css';
import $jsonp from 'common/jsonp.js';
Vue.prototype.$jsonp=$jsonp
// import './assets/playIcon/iconfont.css'

Vue.use(Vant);

Vue.config.productionTip = false

Vue.filter('toTime', function(value) {
	if (!value) {
		return '00:00';
	}
	
	let min = parseInt(value / 60);
	let sec = parseInt(value % 60)
	// sec=sec < 10 ? '0' + sec : sec 
	return min < 10 ? '0' + min + ':' + (sec < 10 ? '0' + sec : sec) : min + ':' +( sec < 10 ? '0' + sec : sec);
})



/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	// store,
	components: {
		App
	},
	template: '<App/>'
})
