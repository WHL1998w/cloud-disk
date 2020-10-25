import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 将登录后的user和token作为状态管理对象，定义actions为登录方法，
// 调用 的时候用dispatch分发，这样做的好处是可以包含异步操作

import $H from '../common/request.js';

export default new Vuex.Store({
	state: {
		user:null,
		token:null
	},
	actions:{
		//退出登录
		logout({ state }){
			$H.post('/logout', {},{
				token:true
			})
			state.user = null
			state.token = null
			uni.removeStorageSync('user')
			uni.removeStorageSync('token')
			
			uni.reLaunch({
				url: '/pages/login/login'
			})
		},
		//登录
		login({ state },user){
			state.user = user
			state.token = user.token
			
			uni.setStorageSync('user', JSON.stringify(user))
			uni.setStorageSync('token', user.token)
		},
		//初始化用户信息
		initUser({ state }){
			let user = uni.getStorageSync('user')
			if(user){
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		updateSize({ state },e){
			state.user.total_size = e.total_size
			state.user.used_size = e.used_size
		}
	}
})