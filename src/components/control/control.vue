<template>
	<div class="user-control">
		<div class="content">
			<marquee class="audioName">{{ audioName }}</marquee>
			<van-image class="" round width="10rem" height="10rem" :src="img_url" />
			<div class="lyrics" ref="wrapper">
				<ul>
					<li v-if="noLyric">未搜索到歌词！换首歌试试！</li>
					<li ref="li" v-for="(lyrics, index) in lines" :key="index" :class="{ current: currentLineNum === index }">{{ lyrics.txt }}</li>
				</ul>
			</div>
		</div>
		<van-slider v-model="progressValue" @change="onChange" />
		<span class="curTime">{{ curTime | toTime }}</span>
		<span class="totalTime">{{ totalTime | toTime }}</span>
		<div class="control">
			<van-button type="default" @click="playMod"><span class="iconfont" :class="icon"></span></van-button>
			<van-button type="default" @click="preSong"><span class="iconfont icon-zuoyishou"></span></van-button>
			<van-button type="default" @click="playState"><span class="iconfont" :class="[isPlaying ? 'icon-bofang' : 'icon-zanting']"></span></van-button>
			<van-button type="default" @click="nextSong"><span class="iconfont icon-youyishou"></span></van-button>
			<van-button type="default" @click="openList"><span class="iconfont icon-liebiao"></span></van-button>
		</div>
		<audio @ended="endedSong" @canplay="getDuration" @timeupdate="updateTime" ref="audio" :src="song_url">Your browser does not support the audio element.</audio>
	</div>
</template>

<script>
import EventBus from 'eventBus/eventBus.js';
import 'assets/font/iconfont.css';
import Lyric from 'lyric-parser';
import BScroll from 'better-scroll';
// import jsonp from 'common/jsonp.js';
export default {
	data() {
		return {
			noLyric: false, //歌词是否为空
			ended: false, //是否播放完成
			loop: true, //是否循环
			isPlaying: true, //播放状态 暂停-播放？
			scroll: null, //better-scroll对象
			currentLyric: null, //处理后的歌词
			progressValue: 0, //进度条
			curTime: 0, //当前歌曲时间
			totalTime: 0, //歌曲总时长
			state: 0,
			icon: ['icon-danquxunhuan'], //更换图标类名，以显示不同图标
			iconBuff: ['icon-danquxunhuan', 'icon-liebiaoxunhuan', 'icon-suijixunhuan'],
			song_url: '', //歌曲地址
			img_url: 'https://img.yzcdn.cn/vant/cat.jpeg', //图片地址
			lyrics: '', //原始歌词数据
			audioName: '',
			lines: {}, // 单独一行的歌词数据
			currentLineNum: 0, //歌词滚动到哪一行
			fileHash: '', //
			albumId: '', //
			songData: [], //搜索歌曲返回的30首歌曲
			currentSongData: {}, //当前播放的歌曲
			songIndex: '' //当前歌曲的下标
		};
	},
	methods: {
		playMod() {
			//改变播放模式的图标  随机，列表，单曲
			this.state++;
			if (this.state === 3) {
				this.state = 0;
			}
			this.icon.splice(0, 1, this.iconBuff[this.state]);
		},
		endedSong() {
			//判断歌曲结束时的播放模式
			switch (this.state) {
				case 0:
					{
						this.$refs.audio.loop = true;
						this.getLyric(this.lyrics);
						console.log('xunhuan');
					}

					break;
				case 1:
					{
						this.$refs.audio.loop = false;
						this.nextSong();
						console.log('xiayishou');
					}
					break;
				case 2:
					{
						this.songIndex = Math.floor(Math.random() * 30);
						console.log('xuiji');
					}
					break;
				default:
					break;
			}
		},
		playState() {
			//播放状态，暂停？播放
			this.currentLyric.togglePlay();
			if (this.isPlaying) {
				this.isPlaying = false;
				this.$refs.audio.pause();
			} else {
				this.isPlaying = true;
				this.$refs.audio.play();
			}
		},
		openList() {
			//打开歌单列表
			this.$router.push({ name: 'songList' });
		},

		getDuration() {
			//获取歌曲播放时间
			this.totalTime = parseInt(this.$refs.audio.duration); //加载完成才能获取时间，否则为nan
		},
		updateTime(e) {
			//获取当前播放时间，播了多少
			this.curTime = parseInt(e.target.currentTime);
		},
		onChange() {
			//进度条变化时，歌曲快进或后退
			this.$refs.audio.currentTime = (this.progressValue / 100) * this.$refs.audio.duration;
			this.currentLyric.seek(this.$refs.audio.currentTime * 1000);
		},
		getLyric(lyr) {
			//获取歌词，利用lyric-parser对歌词进行处理
			if (this.currentLyric) {
				this.currentLyric.stop();
			}
			this.currentLyric = new Lyric(lyr, this.handleLyric);
			this.lines = this.currentLyric.lines;

			if (!this.lines.length) {
				this.noLyric = true;
			}
			this.$refs.audio.play();
			this.currentLyric.play();
		},
		handleLyric({ lineNum, txt }) {
			//回调函数
			this.currentLineNum = lineNum;
			if (lineNum > 5) {
				let lineEl = this.$refs.li[lineNum - 5];
				this.scroll.scrollToElement(lineEl, 1000);
			} else {
				this.scroll.scrollTo(0, 0, 1000); // 滚动到顶部
			}
		},
		nextSong() {
			//下一首
			this.songIndex += 1;
			if (this.songIndex > 29) {
				this.songIndex = 0;
			}
			
		},
		preSong() {
			//上一首
			this.songIndex -= 1;
			if (this.songIndex < 0) {
				this.songIndex = 29;
			}
		},
		async lyricScroll() {//歌词滚动效果
			this.scroll = new BScroll(this.$refs.wrapper, {
				scrollY: true,
				click: true
			});
			await this.getSongData()
				.then(res => {
					this.song_url = res.data.play_url;
					this.img_url = res.data.img;
					this.lyrics = res.data.lyrics;
					this.audioName = res.data.audio_name;
				})
				.catch(error => {
					console.log(error);
				});

			this.getLyric(this.lyrics);
		},
		getSongData() {
			//获取当前歌曲详细信息，包含播放地址等
			return this.$jsonp('https://wwwapi.kugou.com/yy/index.php', {
				r: 'play/getdata',
				callback: 'jQuery191039303292123524747_1580905792454',
				hash: this.currentSongData.FileHash,
				album_id: this.currentSongData.AlbumID,
				dfid: '0iAROB2HZvpX0gPZpW0nfTqc',
				mid: '49bc127fa8362dbbef2a6fe2626b500b',
				platid: 4,
				_: 1580905792456
			});
		}
	},
	created() {
		var _this = this;
		EventBus.$on('play', res => {
			_this.songData = res;
			_this.songIndex = res.songIndex;
			_this.currentSongData = res[_this.songIndex];
		});
	},
	mounted() {},
	beforeDestroy() {
		EventBus.$off('play');
	},
	watch: {
		curTime() {
			this.progressValue = (this.curTime * 100) / this.totalTime;
		},
		songIndex() {
			//歌曲下标改变时重新获取歌曲详细信息
			this.isPlaying = true;
			this.scroll = null;
			this.currentSongData = this.songData[this.songIndex];
			this.lyricScroll();
		}
	}
};
</script>

<style>
.user-control {
}
.control {
	margin-top: 1.5rem;
	overflow: hidden;
	text-align: center;
	font-size: 2rem;
}
.control button {
	display: block;
	float: left;
	width: 20%;
}

.van-button {
	font-size: inherit;
}
.content {
	text-align: center;
}
.content img {
	margin-top: 0.5rem;
}
.lyrics {
	width: 100%;
	height: 21rem;
	overflow: hidden;
}
.lyrics ul li {
	margin: 5px 0;
}
.van-slider__button {
	width: 1rem;
	height: 1rem;
}
.van-slider__bar {
	height: 4px;
}
.curTime {
	float: left;
}
.totalTime {
	float: right;
}
.current {
	color: orangered;
}
.audioName {
	font-size: 1.25rem;
	color: #1989fa;
}
</style>
