import request from '@/utils/request'

// 用户名密码登录
export function loginByJson( data ){
	return request({
		url:'/api/u/loginByJson',
		method:"post",
        data
	})
}

// 发送注册或登录验证码
export function sendCaptcha( params ){
	return request({
		url:'/api/sms/sendRegisterOrLoginCaptcha',
		params
	})
}

// 手机验证码登录
export function loginByMobile( data ){
	return request({
		url:'/api/u/loginByMobile',
		method:"post",
        data
	})
}

// 获取用户信息
export function getInfo( params ){
	return request({
		url:'/api/member/getInfo',
		params
	})
}

//退出登录
export function logout(){
	return request({
		url:'/api/u/logout'
	})
}

// 检查是否购买过该课程
export function checkAuth( params ){
	return request({
		url:'/api/course/checkAuth',
		params
	})
}

// 下载课程资料
export function downloadAttachment( params ){
	return request({
		url:'/api/course/downloadAttachment',
		params
	})
}

// 播放课程
export function play( params ){
	return request({
		url:'/api/player/play',
		params
	})
}

// 记录播放历史
export function recordHistory( data ){
	return request({
		url:'/api/course/history/recordHistory',
		method:'post',
		data
	})
}

// 最后一次记录
export function getLastHistoryByChapterId( params ){
	return request({
		url:'/course/history/getLastHistoryByChapterId',
		params
	})
}