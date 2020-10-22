<template>
	<view>
		<nav-bar>
			<text slot="left" class="font-md ml-3">首页</text>
			<template slot="right">
				<view style="width: 60rpx;height: 60rpx;" class="flex align-center justify-center bg-icon rounded-circle mr-3"><text class="iconfont icon-zengjia"></text></view>
				<view style="width: 60rpx;height: 60rpx;" class="flex align-center justify-center bg-icon rounded-circle mr-3"><text class="iconfont icon-gengduo"></text></view>
			</template>
		</nav-bar>
		 <view class="bg-info" style="height: 1000px;">		 
		         <!-- 搜索框，设置圆角 -->
		        <uni-search-bar :radius='100'></uni-search-bar>
		    </view>
			 <text v-for="(item,index) in list" :key="item.id">{{item.name}}{{item.price}},</text>
	</view>
</template>
<script>
import uniSearchBar from '@/components/common/search/uni-search-bar/uni-search-bar.vue'
import navBar from '@/components/common/nav-bar.vue';
export default {
	data() {
		return {
			title: 'index',
			list: [
			        // {
			        //   type: 'dir',
			        //   name: '我的笔记',
			        //   create_time: '2020-10-21 08:00',
			        //   checked: false
			        // },
			        // {
			        //   type: 'image',
			        //   name: '风景.jpg',
			        //   create_time: '2020-10-21 08:00',
			        //   checked: false
			        // },
			        // {
			        //   type: 'video',
			        //   name: 'uniapp实战教程.mp4',
			        //   create_time: '2020-10-21 08:00',
			        //   checked: false
			        // },
			        // {
			        //   type: 'text',
			        //   name: '记事本.txt',
			        //   create_time: '2020-10-21 08:00',
			        //   checked: false
			        // },
			        // {
			        //   type: 'none',
			        //   name: '压缩包.rar',
			        //   create_time: '2020-10-21 08:00',
			        //   checked: false
			        // }
			      ]
		};
	},	
	
	onLoad() {
		this.getShare()
		
	},
	 methods: {
	    getShare(){
	      uni.request({
	        url: 'http://127.0.0.1:7001/list',
	        method: 'GET',
	        success: res => {
	          this.list = res.data.data;
	          console.log(this.list)
	        },
	        fail: function(err) {
	          uni.showToast({
	            title: '请求失败'
	          });
	        },
	        
	      })
	    },
	  },
	components:{
		navBar,
		uniSearchBar
	}
};
</script>

<style>

</style>
