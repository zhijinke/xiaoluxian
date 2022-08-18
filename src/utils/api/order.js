import request from '@/utils/request'

// 创建Token，防止重复提交
export function settlement(data){
	return request({
		url:'/api/order/settlement',
        method:'post',
        data
	})
}

// 支付宝支付
export function alipay(data){
	return request({
		url:'/api/pay/alipay/createOrder',
        method:'post',
        data
	})
}

// 支付宝短轮寻订单状态查询
export function queryAlipay(params){
	return request({
		url:'/api/pay/alipay/queryOrder',
        params
	})
}

// 微信支付
export function wxpay(data){
	return request({
		url:'/api/pay/wxpay/createOrder',
        method:'post',
        data
	})
}

// 微信短轮寻订单状态查询
export function queryWxpay(params){
	return request({
		url:'/api/pay/wxpay/queryOrder',
        params
	})
}