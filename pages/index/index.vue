<template>
	<view>
	
		<!-- 自定义导航栏 -->
		<nav-bar>
			<template v-if="checkCount === 0">
				<template slot="left">
					<view style="width: 60rpx;height: 60rpx;" class="flex align-center justify-center bg-light rounded-circle ml-3" hover-class="bg-hover-light"
					@tap="backup"
					v-if="current"
					><text class="iconfont icon-fanhui"></text></view>
				</template>
		<text class="font-md ml-3">{{current?current.name:'首页'}}</text>
			<template slot="right">
				<view 
					style="width: 60rpx;height: 60rpx;"
					class="flex align-center justify-center bg-light rounded-circle mr-3"
					@tap="openAddDialog"
					>
					<text class="iconfont icon-zengjia"></text>
				</view>
				
				<view 
					style="width: 60rpx;height: 60rpx;"
					class="flex align-center justify-center bg-light rounded-circle mr-3"
					@click="openSortDialog"
					>
					<text class="iconfont icon-gengduo"></text>
				</view>
			</template>
			</template>
			
			<template v-else>
				<view slot='left' class="font-md ml-3 text-primary" @click="handleCheckAll(false)">取消</view>
				<text class="font-md font-weight-bold">已选中{{checkCount}}个</text>
				<view slot='right' class="font-md mr-3 text-primary" @click="handleCheckAll(true)">全选</view>
			</template>
		</nav-bar>
		
		<!-- 搜索框 -->
		<view class="px-3 py-2" >
			<view class="position-relative">
				<view class="flex align-center justify-center text-light-muted"
				style="height: 70rpx;width: 70rpx;position: absolute;top: 0;left: 0;">
					<text class="iconfont icon-sousuo"></text>
				</view>
				<input type="text"
				 style="height: 70rpx;padding-left: 70rpx;"
				 class="bg-light font-md rounded-circle" 
				 placeholder="搜索网盘文件"
				 @input="search"
				 />
			</view>
			<!-- <uni-search-bar :radius="100" placeholder="搜索网盘文件" ></uni-search-bar> -->
		</view>
		
		<!-- 正文主体部分 -->
		<!-- <view v-for="(item,index) in list" :key="index">
		      <fList :item="item"></fList> -->
		<f-list v-for="(item,index) in list" :key="index" :item="item"  @click="doEvent(item)" :index="index" @select="select"></f-list>	  
		
		<!-- 底部操作条 -->
		<view v-if="checkCount > 0">
			<view class="flex align-stretch bg-primary text-white fixed-bottom">
				<view class="flex-1 flex flex-column align-center justify-center"
				style="line-height: 1.6;"
				v-for="(item,index) in actions"
				:key="index"
				hover-class="bg-hover-primary"
				@click="handleBottomEvent(item)"
				>
				<text class="iconfont" :class="item.icon"></text>
				{{ item.name }}
				</view>
			</view>
		</view>	
		
		<!-- 是否删除 -->
		<f-dialog ref="delete">是否删除选中的文件?</f-dialog>
		<f-dialog ref="rename">
			<input 
			type="text"
			v-model="renameValue"
			class="flex-1 bg-light rounded px-2"
			style="height: 95rpx;"
			placeholder="重命名"
			/>
		</f-dialog>
		
		<!-- 新建文件夹，使用自定义弹出层，input插槽，绑定data中newdirname变量 -->
		<f-dialog ref="newdir">
			<input
				type="text"
				v-model="newdirname"
				class="flex-1 bg-light rounded px-2"
				style="height: 95rpx;"
				placeholder="新建文件夹名称"
			 />
		</f-dialog>
		
		<!-- 添加操作条，应当能理解这里ref的作用了，type表示弹出的位置类型，具体取值都在popup子组件中 -->
		<uni-popup ref="add" type="bottom">
			<view class="bg-white flex" style="height: 200rpx;">
				<!-- 遍历addlist数组，纵向flex,为每个操作分配等高空间，每个操作有名称和图标 -->
				<view 
				class="flex-1 flex align-center justify-center flex-column"
				hover-class="bg-light"
				v-for="(item,index) in addList"
				:key="index"
				@tap="handleAddEvent(item)"
				>
				<!-- 每个操作的图标，可以传入图标名称和颜色，灵活 -->
					<text 
					class="rounded-circle bg-light iconfont flex align-center justify-center"
					style="width: 110rpx;height: 110rpx;"
					:class="item.icon + ' ' + item.color"
					>
					</text>
					<!-- 每个操作的名称 -->
					<text class="font text-muted">{{ item.name }}</text>
				</view>
			</view>
		</uni-popup>
	 <!-- 排序框，底部弹出，遍历排序操作数组，为当前索引项绑定文字蓝色样式 -->
		<uni-popup ref="sort" type="bottom">
			<view class="bg-white">
				<view v-for="(item,index) in sortOptions" :key="index" class="flex align-center justify-center py-3 font
				border-bottom border-light-secondary"  :class="index === sortIndex ? 'text-main' : 'text-dark'"
				hover-class="bg-light" @click="changeSort(index)">
				{{item.name}}	
				</view>
			</view>
		</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue';
	import fDialog from '@/components/common/f-dialog.vue';
	import fList from '@/components/common/f-list.vue';
	import navBar from '@/components/common/nav-bar.vue';
	
	export default {
		components:{
		fList,
		fDialog,
		uniPopup,
		navBar
		},
		data() {
			return {
				dirs:[],
				sortIndex:0,
				sortOptions:[
					{
						name:'按名称排序',
						key: 'name'
					},
					{
						name:'按时间排序',
						key: 'created_time'
					}
				],
				 renameValue: '',
				 newdirname:'',
				 list:[],
				addList:[{
				          icon:"icon-file-b-6",
				          color:"text-success",
				          name:"上传图片"
				        },{
				          icon:"icon-file-b-9",
				          color:"text-primary",
				          name:"上传视频"
				        },{
				          icon:"icon-file-b-8",
				          color:"text-muted",
				          name:"上传文件"
				        },{
				          icon:"icon-file-b-2",
				          color:"text-warning",
				          name:"新建文件夹",
				        }]
			};
		},
		props:{
			item:Object,
			index:0
		},	
	onLoad() {
		let dirs =uni.getStorageSync('dirs');
		if(dirs){
			this.dirs=JSON.parse(dirs);
		}
		this.getData()
	},
		methods:{
			//分享
			share(){
				this.$H
				.post(
				'/share/create',
				{
					file_id:this.checkList[0].id
				},
				{token:true}
				)
				.then(res=>{
					uni.showModal({
						content:res,
						showCancel:false,
						success:result=>{
							uni.setClipboardData({
								//复制到剪贴板
								data:res,		
								success:()=>{
									console.log('复制成功',res);
									uni.showToast({
										title:'复制成功',
										icon:'none'
									})
								}
							})
						}
					})
				})
				
			},
			//下载文件
			download(){
				this.checkList.forEach(item=>{
					if(item.isdir===0){
						const key=this.getID(8);
						let obj={
							name:item.name,
							type:item.type,
							size:item.size,
							key,
							progress:0,
							status:true,
							created_time:new Date().getTime()
						};
						//创建下载任务
						this.$store.dispatch('createDownLoadJob',obj);
						let url=item.url;
						let d=uni.downloadFile({
							url,
							success:res=>{
								if(res.statusCode===200){
									console.log('下载成功',res);
									uni.saveFile({
										tempFilePath:item.tempFilePath
									});
								}
							}
						});
						d.onProgressUpdate(res=>{
							this.$store.dispatch('updateDownLoadJob',{
								progress:res.progress,
								status:true,
								key
							});
						});
					}
				});
				uni.showToast({
					title:'已加入下载任务',
					icon:'none'
				});
				this.handleCheckAll(false);
			},
			//生成唯一的key
			getID(length){
				return Number(
				Math.random().toString().substr(3,length)+Date.now()).toString(36);
			},
			//上传
		  	upload(file,type){
				//上传文件的类型
				let t =type;
				//上传文件的key,用来区分每一个文件
				const key =this.getID(8);
				//构建上传文件的对象，文件名，类型，大小，唯一的Key,进度，状态，创建时间
				let obj={
					name:file.name,
					type:t,
					size:file.size,
					key,
					progress:0,
					status:true,
					created_time:new Date().getTime()
				};
				//创建上传任务，分发给Vuex的Acitions，异步上传调度，主要是实现上传进度的调度
				this.$store.dispatch('createUploadJob',obj);
				//上传，查询参数为当前位置所在目录的id,body为参数为文件  路径
				this.$H
				.upload(
				'/upload?file_id='+this.file_id,
				{
					filePath:file.path,
					},
				p=>{
					//更新上传任务进度
					this.$store.dispatch('updateUploadJob',{
						status:true,
						progress:p,
						key
					});
				}
				).then(res=>{
					//上传成功，请求数据更新列表
					this.getData();
				});
			},
			//搜索文件
			search(e){
						if(e.detail.value== ''){
							return this.getData();
						}
						this.$H
						.get('/file/search?keyword='+e.detail.value,{
							token:true
						})
						.then(res=>{
							this.list = this.formatList(res.rows);
						})
					},
			formatList(list){
				return list.map(item=>{
					let type ='none';
					if(item.isdir===1){
						type='dir';
					}else{
						type=item.ext.split('/')[0]||'none';
					}
					return {
						type,
						checked:false,
						...item
					};
				});
			},
			getData(){
				console.log(this.file_id+'>>>>>>>>>>>>>>')
				let orderby=this.sortOptions[this.sortIndex].key;
				console.log(orderby+'<<<<<<<<<<')
				this.$H
				.get(`/file?file_id=${this.file_id}&orderby=${orderby}`,{
					token:true
				})
				.then(res=>{
					console.log(res);
					this.list=this.formatList(res.rows)
				})
			},
			//返回上一个目录
			backup(){
				this.dirs.pop();
				this.getData();
				uni.setStorage({
					key:'dirs',
					data:JSON.stringify(this.dirs)
				});
			},
			changeSort(index){
				// this.sortIndex=index;
				// this.$refs.sort.close();
				this.sortIndex=index;
				this.getData();
				this.$refs.sort.close();
			},
			openSortDialog(){
				this.$refs.sort.open();
			},
			doEvent(item) {
						switch(item.type) {
							case 'image':
							let images = this.list.filter(item => {
								return item.type === 'image'
							})
							uni.previewImage({
								current:item.url,
								urls:images.map(item=>item.url)
							})
							break;
							case 'video':
							uni.navigateTo({
								url:'../video/video?url='+item.url + '&title='+item.name,
							});
							break;
							default:
							this.dirs.push({
								id:item.id,
								name:item.name
							});
							this.getData();
							uni.setStorage({
								key:'dirs',
								data:JSON.stringify(this.dirs)
							});
							break;
						}
					},
			select(e){
				//接受子组件传递过来的索引选中状态，将对应的list中的数据更新
				this.list[e.index].checked = e.value
			},
			handleCheckAll(checked){
				this.list.forEach(item => {
					item.checked = checked;
				});
			},
			//处理底部操作条事件，这里仅对“删除”
			handleBottomEvent(item){
				switch(item.name){
					case '删除':
					this.$refs.delete.open(close => {
											uni.showLoading({
												title:'删除中.......',
												mask:false
											})
											let ids =this.checkList.map(item=>item.id).join(',');
											this.$H
											.post('/file/delete',{ids},{token:true})
											.then(res=>{
												this.getData();
												uni.showToast({
													title:'删除成功',
													icon:'none'
												});
												uni.hideLoading();
											})
											.catch(err=>{
												uni.hideLoading();
											})
											close();
					});
					break;
					
					case '重命名':
					//重命名只能对单个文件，所以this.checkList[0],也就是唯一元素
						this.renameValue = this.checkList[0].name;
						this.$refs.rename.open(close => {
							if(this.renameValue == ''){ 
								return uni.showToast({
									title: '文件名称不能为空',
									icon: 'none'
								});
							}
							console.log(this.checkList[0].id+'>>>>>>'+this.file_id);
							//重命名需要三个参数，自身id，目录id,新名称
							this.$H
							.post(
							'/file/rename',
							{
								id:this.checkList[0].id,
								file_id:this.file_id,
								name:this.renameValue
							},
							{token:true})
							.then(res=>{
								this.checkList[0].name=this.renameValue;
								uni.showToast({
									title:'重命名成功',
									icon:'none'
								})
							})
							close();
						});
						break;
					case '下载':
					this.download();
					case '分享':
					 this.share();
					 this.handleCheckAll(false)
					break;
					default:
					break;
				}
			},
			openAddDialog(){
				this.$refs.add.open();
			},
			//处理添加操作的各种事件
			handleAddEvent(item){
				this.$refs.add.close();
				switch(item.name){
					case '上传图片':
					//选择照片，限制为9张
					uni.chooseImage({
						count:9,
						success:res=>{
							//选择照片成功，就循环异步调用上传接口
							res.tempFiles.forEach(item=>{
								this.upload(item,'image');
							});
						}
					});
					break;
					//选择视频上传        
					case '上传视频':
						uni.chooseVideo({
							count:1,
							success:(res)=>{
								console.log(res);
								let name=''
								let size=0
								// #ifndef H5
								name=res.tempFilePath.substring(res.tempFilePath.lastIndexOf('/')+1)
								size =res.size
								// #endif
								this.upload({
									path:res.tempFilePath,
										name,
										type:"video",
										size
								})
							}
						});
						break
					case '新建文件夹':
					this.$refs.newdir.open(close => {
						if(this.newdirname == ''){
							return uni.showToast({
								title:'文件夹名称不能为空',
								icon:'none'
							});
						}
						this.$H
						.post(
						'/file/createdir',
						{
							file_id:this.file_id,
							name:this.newdirname
						},
						{token:true}
						)
						.then(res=>{
							this.getData();
							uni.showToast({
								title:'新建文件夹成功',
								icon:'none'
							});
						});
						close();
						this.newdirname='';
					});
					break;
				default:
					break;
				}
			}
		},
		computed:{
			file_id(){
				let l=this.dirs.length;
				if(l===0){
					return 0;
				}
				return this.dirs[l-1].id;
			},
			current(){
				let l =this.dirs.length;
				if(l===0){
					return false;
				}
				return this.dirs[l-1];
			},
			//选中列表
			checkList(){
				return this.list.filter(item => item.checked);
			},
			checkCount() {
				return this.checkList.length;
			},
			//操作菜单
			actions(){
				if(this.checkCount > 1){
					return[{
						icon:"icon-xiazai",
						name:"下载"
					},{
						icon:"icon-shanchu",
						name:"删除"
					}]
				}
				return[{
					icon:"icon-xiazai",
					name:"下载"
				},{
					icon:"icon-fenxiang-1",
					name:"分享"
				},{
					icon:"icon-shanchu",
					name:"删除"
				},{
					icon:"icon-chongmingming",
					name:"重命名"
				}]
			}
		}
	}
</script>

<style lang="scss">
</style>