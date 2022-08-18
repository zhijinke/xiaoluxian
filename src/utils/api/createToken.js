import request from '@/utils/request'

// 创建Token，防止重复提交
export function createToken(){
	return request({
		url:'/api/token/createToken',
	})
}