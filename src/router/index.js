import Vue from 'vue'
import Router from 'vue-router'
import SearchResult from 'components/searchResult/SearchResult.vue'
import SongList from 'components/songList/songList.vue'
import Control from 'components/control/control.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
    	path:'/',
    	// redirect:{
    	// 	// name:'homePage'
    	// }
    },{
		
      path: '/results',
      name: 'searchResult',
      component: SearchResult
    },
	{
		path:'/control',
		name:'controlPlay',
		component:Control
	},{
		path:'/songs',
		name:'songList',
		component:SongList
	}
  ]
})
