import request from '@/utils/request'

// 修改用户信息
export function update(data,token){
	return request({
		url:'/api/member/update',
        method:'post',
        data,
        headers:{
            token
        }
	})
}

// 检查用户名是否存在
export function checkUsername(data,token){
	return request({
		url:'/api/member/checkUsername',
        method:'post',
        data,
        headers:{
            token
        }
	})
}