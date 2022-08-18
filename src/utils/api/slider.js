import request from '@/utils/request'

// 轮播图数据
export function getSliderData(){
	return request({
		url:'/api/slider/getSliders'
	})
}

// 获取一级分类的数据
export function getFirstCategorysData(){
	return request({
		url:'/api/course/category/getFirstCategorys'
	})
}

// 获取二级分类的数据
export function getSecondCategorysData(params){
	return request({
		url:'/api/course/category/getSecondCategorys',
        params
	})
}

// 二级分类下方的数据  查询课程
export function getCourseSearchData(data){
	return request({
		url:'/api/course/search',
        method:'post',
        data
	})
}