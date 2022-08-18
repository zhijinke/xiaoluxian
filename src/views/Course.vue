<template>
	<Header></Header>
	<div class='course-filter'>
		<div class="filter-main">
			<div class='filter-item'>
				<div class='item-title'>课程方向：</div>
				<ul>
					<li class='filter-all'>全部</li>
					<li
						v-for="item in stairList" :key="item.id"
						@click="evtFirst(item.id)"
						:class=" item.id == firstId?'allActive':'' "
					>{{item.categoryName}}</li>
				</ul>
			</div>
			<div class='filter-item'>
				<div class='item-title'>课程分类：</div>
				<ul>
					<li class='filter-all'>全部</li>
					<li
						v-for="item in secondList" :key="item.id"
						@click="evtSecond(item.id)"
						:class=" item.id == secondId?'allActive':'' "
					>{{item.categoryName}}</li>
				</ul>
			</div>
			<div class='filter-item'>
				<div class='item-title'>课程难度：</div>
				<ul>
					<li class='filter-all'>全部</li>
					<li
						v-for="item in grade" :key="item.id"
						@click="evtGrade(item.id)"
						:class=" item.id == gradeId?'allActive':'' "
					>{{item.name}}</li>
				</ul>
			</div>
		</div>
	</div>
	<div class='course-list'>
		<div class='list-main'>
			<div class='list-t'>
				<ul>
					<li
						v-for="item in courseFilter" :key="item.id"
						@click="evtFilter(item.id,item.status)"
					>
						<span :class=" item.id == currentIndex ? 'active':'' ">{{item.name}}</span>
						<div class='caret' v-if="item.id==4">
							<el-icon :size='8' :class="item.status=='price-desc'?'active':''"><CaretTop /></el-icon>
							<el-icon :size='8' :class="item.status=='price-asc'?'active':''"><CaretBottom /></el-icon>
						</div>
					</li>
				</ul>
				<div>
					<el-radio-group v-model="radio" class="ml-4"  @change='tabCourse'>
						<el-radio :label="1" >免费课程</el-radio>
						<el-radio :label="2" >会员免费课程</el-radio>
					</el-radio-group>
				</div>
			</div>
			<ul class='list-c'>
				<li
					v-for="item in CourseList" :key="item.id"
					@click="goDetail(item.id)"
				>
					<img :src="item.courseCover" />
					<div class='course-content'>
						<h3>{{item.courseName}}</h3>
						<div>{{courseTypeFn(item.courseLevel)}} · {{item.clicks}}人报名</div>
						<div class='price'>
							<div class='price-vip'>会员专享</div>
							<div class='price-total'>¥ {{item.discountPrice}}</div>
						</div>
					</div>
				</li>
			</ul>
			<div class='list-b'>
				<el-pagination background layout="prev, pager, next"
				 :total="courseTotal" @current-change="currentChange" />
			</div>
		</div>
	</div>
	<Footer></Footer>
</template>


<script setup>
//引入组件
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
//element
import { CaretTop , CaretBottom  } from '@element-plus/icons-vue'
// api
import {getFirstCategorysData,getSecondCategorysData,getCourseSearchData} from '@/utils/api/slider'
// 路由
let router = useRouter()
// mixins 混入 【初级，中级，高级】
import courseType  from '@/mixins/courseType.js'
import { reactive } from '@vue/reactivity'
let {courseTypeFn} = courseType()

// 一级分类的数据
let stairList = ref([])
// 二级分类的数据
let secondList = ref([])
// 查询课程的数据
let CourseList = ref([])
// 课程总数量
let courseTotal = ref(0)
// 课程难度
let grade = ref([
	{id:1,name:'初级'},
	{id:2,name:'中级'},
	{id:3,name:'高级'},
])
// 查询课程的参数
let params = reactive({
	pageNum:1,
	pageSize:8,
	entity:{
		firstCategory:'',
		secondCategory:'',
		courseLevel:'',
		isMember:'',
		isFree:'',
		sortBy:''
	}
})

// 一级class切换数据
let firstId = ref('')
// 二级class切换数据
let secondId = ref('')
// 课程难度class切换数据
let gradeId = ref('')

// 生命周期
onBeforeMount(()=>{
	// 一级分类的数据
	getFirstCategorysData().then(res=>{
		stairList.value = res.data.list
		// 二级分类
		secondCategorys({
			categoryId:-1
		})
		// 查询课程
		getCourseSearch({
			pageNum:1,
			pageSize:8
		})
	})
})

// 获取二级分类的数据
const secondCategorys = (params)=>{
	getSecondCategorysData(params).then(res=>{
		secondList.value = res.data.list
	})
}
// 查询课程
const getCourseSearch = (data)=>{
	getCourseSearchData(data).then(res=>{
		CourseList.value = res.data.pageInfo.list
		courseTotal.value = res.data.pageInfo.total
		// secondList.value =  CourseList.secondCategoryName
		// console.log(res)
	})
}

// 一级分类查询
const evtFirst = (id)=>{
	firstId.value = id
	gradeId.value = ''
	//获取二级分类
	secondCategorys({
		categoryId:id
	})
	// 点一级时把二级和课程难度清空
	params.entity.secondCategory = ''
	params.entity.courseLevel = ''
	params.entity.isMember = '',
	params.entity.sortBy = '',
	params.entity.isFree = '',
	params.entity.firstCategory = id
	getCourseSearch(params)
}
// 二级分类的查询
const evtSecond = (id)=>{
	secondId.value = id
	// 点二级时把课程难度清空
	params.entity.courseLevel = ''
	params.entity.isMember = '',
	params.entity.sortBy = '',
	params.entity.isFree = '',
	params.entity.secondCategory = id
	getCourseSearch(params)
}
// 课程难度查询
const evtGrade = (id)=>{
	gradeId.value = id
	params.entity.courseLevel = id
	getCourseSearch(params)
}

//课程条件筛选的数据
let courseFilter = ref([
	{id:1,name:'综合'},
	{id:2,name:'最新课程'},
	{id:3,name:'最多购买'},
	{id:4,name:'价格',status:''},
]);
// 添加的class的数据
let currentIndex = ref(1)

// 课程条件筛选的点击事件
const evtFilter = (id,status)=>{
	currentIndex.value = id
	if(id==1){
		params.entity.sortBy = '';
		courseFilter.value[3].status = '';
		params.entity.isMember = '';
		params.entity.isFree = '';
	}else if(id==2){
		params.entity.sortBy = 'time-desc';
		courseFilter.value[3].status = '';
		params.entity.isMember = '';
		params.entity.isFree = '';
	}else if(id==3){
		params.entity.sortBy = 'clicks-desc';
		courseFilter.value[3].status = '';
		params.entity.isMember = '';
		params.entity.isFree = '';
	}else if(id==4){
		params.entity.isMember = '';
		params.entity.isFree = '';
		if(status == 'price-desc' || status == ''){
			courseFilter.value[3].status = 'price-asc'
			status = 'price-asc'
		}else{
			courseFilter.value[3].status = 'price-desc'
			status = 'price-desc'
		}
		params.entity.sortBy = status
	}
	getCourseSearch(params)
}

//免费课程 和 会员课程筛选
const radio = ref(3);
// 点击 免费课程 和 会员课程筛选
const tabCourse = (val)=>{
	if(val == '1'){
		params.entity.isMember = '';
	    params.entity.isFree = '1';
	}else if(val == '2'){
		params.entity.isFree = '';
	    params.entity.isMember = '1';
	}
	getCourseSearch(params);
}

// 分页
const currentChange = (val)=>{
	params.pageNum = val
	getCourseSearch(params);
}

// 进入详情页面
const goDetail = (id)=>{
	router.push({
		path:'/course/detail',
		query:{
			id
		}
	})
}

</script>

<style scoped>
.allActive{
	color: #388fff !important;
	padding: 8px 15px;
	background: rgba(44,128,255,.1);
	border-radius: 6px;
}
.active{
	color: #388fff;
}
.course-filter{
	width: 100%;
	height: 197px;
	background: #F3F5F9;
}
.filter-main{
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 1000px;
	height: 197px;
	margin: 0 auto;
}
.filter-item{
	display: flex;
	align-items: center;
}
.item-title{
	margin-left: 20px;
	font-size: 14px;
	font-weight: bold;
	color: #333333;
}
.filter-item ul{
	display: flex;
	align-items: center;
	justify-content: center;
}
.filter-item ul li{
	margin-right: 30px;
	font-size: 14px;
	font-weight: 400;
	color: #515759;
	cursor:pointer;
}
.filter-item ul li.filter-all{
	width: 50px;
	line-height: 30px;
	text-align: center;
	color: #388fff;
    font-size: 14px;
    background: rgba(44,128,255,.1);
    border-radius: 5px;
}
.course-list{
	padding: 50px 0;
	background: #fff;
}
.list-main{
	width: 1000px;
	margin: 0 auto;
}
.list-t{
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}
.list-t ul{
	display: flex;
}
.list-t ul li{
	display: flex;
	align-items: center;
	margin-right: 16px;
	font-size: 14px;
	font-weight: 400;
	color: #515759;
	cursor: pointer;
	position: relative;
}
.list-t ul li + li:after{
	content:'';
	position: absolute;
	height: 100%;
	width: 2px;
	background: #DBD9D9;
	left: -8px;
}
.caret{
	display: flex;
	flex-direction: column;
}
.list-c{
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}
.list-c li {
	float: left;
	margin-top: 38px;
	width: 240px;
	height: 275px;
	background: #FFFFFF;
	box-shadow: 1px 3px 3px rgba(27, 39, 94, 0.1);
	border-radius: 5px;
}
.list-c li:last-child:nth-child( 4n + 2 ){
	margin-right: calc(( 100% - 240px ) / 3 * 2 );
}
.list-c li:last-child:nth-child( 4n + 3 ){
	margin-right: calc(( 100% - 240px ) / 3 * 1 );
}
.list-c li img{
	width: 240px;
	height: 153px;
}
.course-content{
	padding: 7px 16px;
}
.course-content h3{
	font-size: 12px;
	color: #333333;
}
.course-content >div{
	padding: 7px 0;
	font-size: 12px;
	color: #808080;
}
.price{
	display: flex;
}
.price-vip{
	width: 64px;
	height: 16px;
	margin-right: 3px;
	text-align: center;
	color: #fff;
	background: linear-gradient(90deg, #FF928E 0%, #FE7062 99%);
	border-radius: 16px 0px 16px 0px;
}
.price-total{
	font-size: 12px;
	color: #FF727F;
}
.list-b{
	padding-top: 50px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>