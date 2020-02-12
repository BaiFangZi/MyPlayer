<template>
	<div id="app">
		<van-search v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch" @keyup.enter="onSearch" >
			<div slot="action"  @click="onSearch">搜索</div>
		</van-search>
		
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'App',

	data() {
		return {
			value: '',
			queryKey: {
				keyword: ''
			},
		
		};
	},
	methods: {
		onSearch() {
			this.$router.push({ name: 'searchResult', query: this.queryKey });
		},
	
	},
	watch: {
		value() {
			this.queryKey.keyword = this.value;
		}
	}
};
</script>

<style>
#app {
	/* display: flex; */
}
.van-search {
	background-color: darkgray;
}
</style>
