<template>
	<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
		<van-cell v-for="(item, index) in list" :key="index" :title="item.FileName | trimTag" :label="item.Duration | toTime" @click="playSong(index)" />
	</van-list>
</template>

<script>
import EventBus from 'eventBus/eventBus.js';
// import jsonp from "common/jsonp.js"
export default {
	data() {
		return {
			list: [],
			songList: [],
			loading: false,
			finished: false,
			refreshing: false,
			url_params: {
				// callback: 'jQuery112408575916011569715_1580652891414',
				keyword: this.$route.query.keyword,
				page: 1,
				pagesize: 30,
				userid: -1,
				clientver: '',
				platform: 'WebFilter',
				tag: 'em',
				filter: 2,
				iscorrection: 1,
				privilege_filter: 0,
				_: 1580652891416
			},
		};
	},
	created() {
		this.$jsonp('https://songsearch.kugou.com/song_search_v2',this.url_params,{params:'callback'})
			.then(res => {
				this.songList = res.data.lists;
				
			})
			.catch(error => {
				console.log(error);
			});
	},
	destroyed() {
		EventBus.$emit('play', this.songList);
	},
	methods: {
		onLoad() {
			setTimeout(() => {
				if (this.refreshing) {
					this.list = [];
					this.refreshing = false;
				}
				for (let i = 0; i < 5; i++) {
					this.list.push(this.songList[this.list.length]);
					// this.list.push(this.list.length + 1);
				}
				this.loading = false;
				if (this.list.length >= 25) {
					this.finished = true;
				}
			}, 1000); 
		},

		playSong(songIndex) {
			this.songList.songIndex=songIndex	
			this.$router.push({ name: 'controlPlay'});
		}
	},
	filters: {
		trimTag(value) {
			if (!value) {
				return '';
			}
			return value.replace(/<[^<>]+>/g, '');
		},	
	}
};
</script>

<style>
.van-cell {
	padding: 5px 16px;
}
</style>
