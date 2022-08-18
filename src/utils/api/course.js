import request from '@/utils/request'

// 新上好课
export function getMostNewData( data ){
	return request({
		url:'/api/course/mostNew',
		method:"post",
        data
	})
}

// 课程详情
export function getDetailData( params ){
	return request({
		url:'/api/course/getDetail',
        params
	})
}