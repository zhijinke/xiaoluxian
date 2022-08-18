<template>
	<Header></Header>
	<div class='detail-title'>
		<div class='detail-main'>
			<div class='detail-map'>
				 <el-breadcrumb :separator-icon="ArrowRight">
			    <el-breadcrumb-item>课程</el-breadcrumb-item>
			    <el-breadcrumb-item>免费课</el-breadcrumb-item>
			    <el-breadcrumb-item>{{courseName}}</el-breadcrumb-item>
			  </el-breadcrumb>
			</div>
			<div class='detail-name'>{{courseName}}</div>
			<div class='detail-content'>难度 入门</div>
		</div>
	</div>
	<div class='detail-container'>
		<div class='tab-name'>
			<ul>
				<li 
					@click='isActive=1'	
					:class=' isActive==1 ? "active":"" ' 
				>章节</li>
				<li 
					@click='isActive=2'
					:class=' isActive==2 ? "active":"" ' 
				>下载笔记代码</li>
			</ul>
		</div>
		<div class='tab-chapters' v-if='isActive==1'>
			<div class='tab-txt'>
				<div class='txt-content'>{{classDescribed?classDescribed:'暂无数据...'}}    
				</div>
				<div class='txt-btn'>
					<div class='payment'>立即购买</div>
					<div class='add-cart' @click="addCart">加入购物车</div>
				</div>
			</div>
			<div class='detail-list' v-for="item in section" :key="item.id">
				<div class='item'>
					<div class='item-title'>
						<div class='item-name'>{{item.chapterName}}</div>
						<div class='item-key'>{{item.description}}</div>
					</div>
					<ul>
						<li v-for="k in item.children" :key="k.id">
							<div class='course'>
								<img src="@/assets/img/detail-video.png" />
								<div>{{k.chapterName}}</div>
							</div>
							<div class='course-video' @click="goPlay(item,k.id)">开始学习</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class='tab-main' v-if='isActive==2'>
			<ul v-if="info.length>0">
				<li v-for="item in info" :key="item.id">
					<div>{{item.attachmentName}}</div>
					<div class='download' @click="downloadSource(item)">下载资料</div>
				</li>
			</ul>
			<ul v-else>
				<li>暂无资料...</li>
			</ul>
		</div>
	</div>
	<Footer></Footer>
</template>

<script setup>
//引入组件
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
//element
import { ArrowRight } from '@element-plus/icons-vue'
// 路由
let route = useRoute()
let router = useRouter()
// api
import {getDetailData} from '@/utils/api/course'
import { onBeforeMount } from '@vue/runtime-core';
//章节 和 下载笔记代码切换数据
let isActive = ref(1);

// 课程详情，课程名称
let courseName = ref('')
// 课程描述
let classDescribed = ref('')
// 课程章节
let section = ref([])
// 下载资料
let info = ref([])
// 课程id
let courseId = ref()
// 会员id
let memberId = ref()


// 生命周期
onBeforeMount(()=>{
	// 课程详情
	getDetailData({
		courseId:route.query.id
	}).then(res=>{
		let data = res.data.data
		courseId.value = data.id
		courseName.value = data.courseName
		classDescribed.value = data.bizCourseDetail.description
		section.value = data.bizCourseChapters
		info.value = data.bizCourseAttachments
	})
})

// pinia
import {useUserStore} from '@/store/user'
let userStore = useUserStore()
// element
import { ElMessage } from 'element-plus'
// api 检查是否购买过该课程
import {checkAuth,downloadAttachment} from '@/utils/api/login'


// 下载资料
const downloadSource = (item)=>{
	// 判断是否登录
	if(!userStore.token){
		// 没登录
		ElMessage({
			message: '请先登录!',
			type: 'warning',
		})
		return;
	}
	// 登录了，判断有没有购买过该课程
	checkAuth({
		courseId:item.courseId
	}).then(res=>{
		// 没有购买过
		if(!res.data.data.hasAuth){
			ElMessage({
				message: '购买过该课程才能下载资料!',
				type: 'warning',
			})
			router.push('/login');
			return;
		}
		// 购买过
		downloadAttachment({
			courseId:item.courseId,
			attachmentId:item.id
		}).then(res=>{
			// 处理后端返回的 Blob 流文件
			const blob = new Blob([res]);
			let fileName = item.attachmentName;
			let fileUrl = item.attachmentUrl;
			const extName = fileUrl.substring(
				fileUrl.lastIndexOf('.')
			)
			fileName = fileName + extName;
			const link = document.createElement('a');
			link.download = fileName;
			link.target = '_blank';
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			document.body.appendChild(link);
			link.click();
			URL.revokeObjectURL(link.href);
			document.body.removeChild(link);
		})
	})
}

// 播放视频
const goPlay = (item,chapterId)=>{
	// 判断是否登录
	if(!userStore.token){
		// 没登录
		ElMessage({
			message: '请先登录!',
			type: 'warning',
		})
		router.push('/login');
		return;
	}
	// 登录了，判断有没有购买过该课程
	checkAuth({
		courseId:item.courseId
	}).then(res=>{
		// 没有购买过
		if(!res.data.data.hasAuth){
			ElMessage({
				message: '购买该课程才可以学习哦～',
				type: 'warning',
			})
			return;
		}
		// 购买过
		downloadAttachment({
			courseId:item.courseId,
			attachmentId:item.id
		}).then(res=>{
			// 进入到播放页
			//有权限
			router.push({
				path: '/course-play/' + item.courseId + '/' + chapterId,
			})
		})
	})
}

// api 
import { addShopCar } from '@/utils/api/cart'
import {createToken} from '@/utils/api/createToken'
// 加入购物车
const addCart = ()=>{
	// 判断是否登录
	if(!userStore.token){
		// 没登录
		ElMessage({
			message: '请先登录!',
			type: 'warning',
		})
		return;
	}
	// 登录过
	memberId.value = useUserStore().userInfo.id
	// 临时token
      createToken().then(res=>{
		let token = res.data.token
			addShopCar({
				courseId:courseId.value,	//课程ID
				memberId:memberId.value	//会员ID
			},token).then(res=>{
				if(res.meta.code == '200'){
					ElMessage.success({
						message: '添加购物车成功!'
					});
				}else{
					ElMessage.warning({
						message: '该商品已经存在购物车中!'
					});
				}
			})
	  })
	
}

</script>

<style scoped>
.detail-title{
	width: 100%;
	height: 183px;
	background: url('@/assets/img/detail-bg.png') no-repeat;
	background-size: 100% 100%;
}
.detail-main{
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 1000px;
	margin: 0 auto;
	height: 100%;
}
::v-deep .el-breadcrumb__separator{
	color: #fff;
}
::v-deep .el-breadcrumb__inner{
		color: #fff;
}
::v-deep .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
	color: #fff;
	font-weight: 500;
}
.detail-name{
	font-size: 27px;
	font-weight: 500;
	color: #FFFFFF;
}
.detail-content{
	font-size: 12px;
	font-weight: 400;
	color: #FFFFFF;
}
.tab-name{
	width: 100%;
	height: 57px;
	background: #FFFFFF;
	box-shadow: 0px 2px 4px rgba(0,0,0,0.1600);
}
.tab-name ul{
	display: flex;
	align-items: center;
	height: 57px;
	width: 1000px;
	margin: 0 auto;
	font-size: 16px;
	cursor: pointer;
}
.tab-name ul li + li{
	margin-left: 67px;
}
.tab-name ul li.active{
	position: relative;
	color: #388FFF;
	font-weight: bold;
}
.tab-name ul li.active:after{
	content: '';
	position: absolute;
	left: 50%;
	margin-left: -20%;
	bottom: -6px;
	width: 40%;
	height: 3px;
	background: #388FFF;
	border-radius: 1px;
}
.tab-chapters{
	width: 1000px;
	margin: 0 auto;
}
.tab-txt{
	margin: 29px 0;
	width: 100%;
	height: 147px;
	background: #FFFFFF;
	box-shadow: 0px 2px 4px rgba(0,0,0,0.0900);
	border-radius: 5px;
}
.txt-content{
	padding: 24px 27px;
}
.txt-btn{
	display: flex;
	justify-content: flex-end;
	cursor: pointer;
}
.payment{
	margin-right: 13px;
	width: 99px;
	height: 30px;
	line-height: 30px;
	text-align: center;
	font-size: 12px;
	color: #FFFFFF;
	background: #F11D1D;
	border-radius: 15px;
}
.add-cart{
	margin-right: 33px;
	width: 99px;
	height: 30px;
	line-height: 30px;
	text-align: center;
	font-size: 12px;
	color: #F11D1D;
	background: #FDE7E7;
	border-radius: 15px;
}
.detail-list{
	margin-top: 30px;
}
.item{
	margin-bottom: 10px;
	width: 100%;
	background: #FFFFFF;
	box-shadow: 0px 2px 4px rgba(0,0,0,0.0900);
	border-radius: 5px;
}
.item-title{
	padding: 16px 27px;
}
.item-name{
	font-size: 16px;
	font-weight: bold;
	color: #333333;
}
.item-key{
	margin-top: 10px;
	font-size: 12px;
	font-weight: 400;
	color: #5C5C5C;
}
.item ul{

}
.item ul li{
	display: flex;
	justify-content: space-between;
	padding: 16px 17px;
	margin: 0 10px;
	/* background: #bfa; */
	/* margin: 5px 0; */
}
.item ul li:hover{
	background: #d2e4ff;
	border-radius: 10px;
}
.item ul li .course{
	display: flex;
}
.course{
	display: flex;
	align-items: center;
	font-size: 16px;
	font-weight: 400;
	color: #333333;
}
.course img{
	width: 13px;
	height: 11px;
	margin-right: 7px;
}
.course-video{
	width: 100px;
	height: 35px;
	text-align: center;
	font-size: 12px;
	color: #FFFFFF;
	line-height:35px;
	background: #388FFF;
	border-radius: 8px;
	cursor: pointer;
}
.tab-main{
	width: 1000px;
	margin: 0 auto;
}
.tab-main ul{
	display: flex;
	flex-direction: column;
	width: 100%;
}
.tab-main ul li{
	display: flex;
	justify-content: space-between;
	padding: 10px;
	margin: 10px 0;
	line-height: 35px;
	font-size: 14px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 3px 6px rgb(0 0 0 / 9%);
}
.download{
	width: 100px;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    background-color: #007bff;
	cursor: pointer;
}
</style>
