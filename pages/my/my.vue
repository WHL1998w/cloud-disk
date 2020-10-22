<template>
	<view>
		<view class="flex align-center justify-around m-2" style="height: 160rpx;">
			<view style="width: 160rpx;height: 160rpx;"><image src="../../static/logo.png" style="width: 160rpx;height: 160rpx;"></image></view>
			<view class="flex-column flex-5 m-2">
				<view><text class="font-md font-weight-bold">昵称</text></view>
				<view class="flex">
					<text class="text-secondary font-sm mr-2">总帖子10</text>
					<text class="text-secondary font-sm">今日发帖0</text>
				</view>
			</view>
			<view><text class="font-sm">></text></view>
		</view>
			<view class="flex align-center px-3 py-2">
				<view class="flex-1 flex flex-column align-center justify-center" v-for="(item,index) in myDemo" :key=index>
				<text class="font-lg font-weight-bold">{{item.num}}</text>
				<text class="font text-muted">{{item.name}}</text>
					</view>
					</view>
		<view class="m-3" style="height: 160rpx;"><image src="../../static/logo.png" style="height: 160rpx;width: 100%; border-radius: 3%;"></image></view>
		<view class="flex flex-column" style="height: 360rpx;">
			<uni-list-item title="浏览历史" showExtraIcon><text slot="icon" class="iconfont icon-liulan"></text></uni-list-item>
			<uni-list-item title="社区认证" showExtraIcon><text slot="icon" class="iconfont icon-huiyuanvip"></text></uni-list-item>
			<uni-list-item title="审核帖子" showExtraIcon><text slot="icon" class="iconfont icon-keyboard"></text></uni-list-item>
		</view>
	</view>
</template>



<script>
	import uniListItem from '@/components/uni-ui/uni-ui/uni-list-item/uni-list-item.vue'
	const demo = [
		{
			name: '动态',
			num:'12'
		},
		{
			name: '动态',
			num:'12'
		},
		{
			name: '动态',
			num:'12'
		},
		{
			name: '动态',
			num:'12'
		},
	]
	export default {
		data() {
			return {
				myDemo:[]
			}
		},
		onLoad() {
			this.myDemo = demo;
		},
		methods: {
			
		},
		components:{
			uniListItem
		}
	}
</script>



<style></style>