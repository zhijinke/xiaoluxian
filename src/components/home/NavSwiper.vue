<template>
	<div class='nav-swiper'>
		<div class='nav-swiper-main'>
			<div class='swiper-t'>
				<ul @mouseleave="mouseOut">
					<!-- class='active' -->
					<li 
					v-for="item in FirstCategorys" :key="item.id"
					@mouseenter="mouseHover(item.id)"
					:class=" item.id == currentId ? 'active':'' "
					>
						<span>{{item.categoryName}}</span>
						<el-icon><ArrowRight /></el-icon>
					</li>
					<div class='active-r' v-if='isShow'>
						<div class="active-r-t">
							<h3 class='active-title'>基础知识</h3>
							<div>
								<div>知识点：</div>
								<ul>
									<li
										v-for='item in secondList'
										:key='item.id'
									>{{ item.categoryName }}</li>
								</ul>
							</div>
						</div>
						<div class="active-r-b">
							<ul>
								<li
									v-for='item in courseList'
									:key='item.id'
								>
									<img :src="item.courseCover" />
									<div>
										<div class="active-course-title">
											{{ item.courseName }}
										</div>
										<div class="active-course-type">{{ courseTypeFn(item.courseLevel)}} · {{ item.clicks }}人报名</div>
										<div class='active-course-price'>免费学习</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</ul>
				<div>
					<el-carousel :interval="3000" arrow="always" v-if="sliders.length>0">
					    <el-carousel-item v-for="item in sliders" :key="item.id">
					      <img :src="item.imageUrl" alt="">
					    </el-carousel-item>
					</el-carousel>
				</div>
			</div>
			<ul class='swiper-b'> 
				<li>
					<h3>
						<img src="@/assets/img/chuji.png" />
					</h3>
					<div>
						<h4>初级课程</h4>
						<span>入门快，岗位多</span>
					</div>
				</li>
				<li>
					<h3>
						<img src="@/assets/img/chuji.png" />
					</h3>
					<div>
						<h4>初级课程</h4>
						<span>入门快，岗位多</span>
					</div>
				</li>
				<li>
					<h3>
						<img src="@/assets/img/chuji.png" />
					</h3>
					<div>
						<h4>初级课程</h4>
						<span>入门快，岗位多</span>
					</div>
				</li>
				<li>
					<h3>
						<img src="@/assets/img/chuji.png" />
					</h3>
					<div>
						<h4>初级课程</h4>
						<span>入门快，岗位多</span>
					</div>
				</li>
				<li>
					<h3>
						<img src="@/assets/img/chuji.png" />
					</h3>
					<div>
						<h4>初级课程</h4>
						<span>入门快，岗位多</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>


<script setup>
//element
import { ArrowRight } from '@element-plus/icons-vue';
import { getSliderData,getFirstCategorysData,getSecondCategorysData,getCourseSearchData } from '@/utils/api/slider'
// mixins 混入 【初级，中级，高级】
import courseType  from '@/mixins/courseType.js'
let {courseTypeFn} = courseType()

// 轮播图数据
const  sliders = ref([])
// 一级分类的数据
const FirstCategorys = ref([])
// 控制左侧的二级图层是否显示的参数
const isShow = ref(false)
// 二级图层上方的数据
const secondList = ref([])
// 二级分类下方的数据
const courseList = ref([])
// 左侧的active是否添加
const currentId = ref('')

// 生命周期
onBeforeMount(()=>{
	// 获取轮播图数据
	getSliderData().then(res=>{
		sliders.value = res.data.list
	})
	// 获取一级分类数据
	getFirstCategorysData().then(res=>{
		FirstCategorys.value = res.data.list
	})
})

// 鼠标移入
const mouseHover = (id)=>{
	currentId.value = id
	isShow.value = true
	// 获取二级分类的数据
	getSecondCategorysData({
		categoryId:id
	}).then(res=>{
		secondList.value = res.data.list
	})
	// 获取二级分类下方的数据
	getCourseSearchData({
		pageNum:1,
		pageSize:4,
		entity:{
			firstCategory:id
		}
	}).then(res=>{
		courseList.value = res.data.pageInfo.list
	})
}
// 鼠标移出
const mouseOut = ()=>{
	isShow.value = false
	currentId.value = ''
}

</script>


<style scoped>
.nav-swiper{
	background: url('@/assets/img/transitionbg.png') no-repeat;
	width: 100%;
	height: 600px;
}
.nav-swiper-main{
	width: 1000px;
	padding: 47px 0;
	margin: 0 auto;
}
.swiper-t{
	display: flex;
	height: 373px;
	border-radius: 11px 11px 0px 0px;
}
.swiper-t>ul{
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 160px;
	height: 100%;
	background: #2B283D;
	border-radius: 11px 0px 0px 0px;
}
.swiper-t>ul>li{
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 120px;
	height: 37px;
	padding: 0 20px;
	font-size: 16px;
	color: #F2F2F2;
	cursor: pointer;
}
.active{
	background: linear-gradient(90deg, #3FE5FF 0%, rgba(62, 222, 255, 0.93) 2%, rgba(60, 203, 255, 0.73) 9%, rgba(58, 186, 255, 0.56) 17%, rgba(57, 172, 255, 0.41) 25%, rgba(55, 160, 255, 0.28) 33%, rgba(54, 150, 255, 0.18) 43%, rgba(53, 142, 255, 0.1) 53%, rgba(53, 137, 255, 0.04) 64%, rgba(53, 133, 255, 0.01) 77%, rgba(53, 133, 255, 0) 100%);
}
.active-r{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: absolute;
	top: 0;
	left: 160px;
	z-index: 999;
	width: 724px;
	height: 373px;
	background: #FFFFFF;
	border-radius: 0px 11px 0px 0px;
}
.active-r-t{
	padding: 23px 30px;
}
.active-r-t>div{
	display: flex;
	margin-top: 11px;
}
.active-r-t>div ul{
	display: flex;
	flex-wrap: wrap;
	margin-left: 7px;
}
.active-r-t>div ul li+li{
	margin-left: 20px;
}
.active-r-b{
	width: 724px;
	height: 217px;
	background: #F3F5F6;
}
.active-r-b > ul{
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	height: 100%;
	padding: 0 30px;
}
.active-r-b > ul li{
	display: flex;
	width: 50%;
}
.active-r-b > ul li img{
	width: 140px;
	height: 81px;
}
.active-r-b > ul li>div{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-left: 4px;
}
.active-course-title{
	font-size: 14px;
	color: #333333;
}
.active-course-type{
	font-size: 12px;
	color: #808080;
}
.active-course-price{
	font-size: 12px;
	color: #3586FF;
}
.swiper-t > div{
	width: 840px;
	height: 373px;
}
.el-carousel{
 	height: 373px;
}
.el-carousel img{
	width: 100%;
	height: 373px;
}
::v-deep .el-carousel__container{
	height: 373px;
}
.swiper-b{
	display: flex;
}
.swiper-b li{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 213px;
	height: 133px;
	cursor: pointer;
	background: #FFFFFF;
	border-radius: 0px 0px 0px 11px;
}
.swiper-b li img{
	width: 64px;
	height: 64px;
}
.swiper-b li div{
	margin-left: 11px;
}
.swiper-b li div h4{
	font-size: 16px;
	color: #333333;
}
.swiper-b li div span{
	font-size: 12px;
	color: #808080;
}
</style>