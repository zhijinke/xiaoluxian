
import { defineStore } from 'pinia'
export const useCartStore = defineStore({
  id: 'cart',
  state: () => {
    return {
      cartList:[], // 购物车商品
      select:[], // 选中商品的id
      orderList:[] // 支付商品的id和数量
    }
  },
  getters:{
    //  比较他们俩长度是否相等
    checkAll(){
        return this.cartList.length == this.select.length
    },
    // 总金额，总数量
    total(){
        this.orderList = []
        let total = {
            price:0,
            num:0
        }
        this.cartList.forEach(v=>{
            if(this.select.indexOf(v.id) != -1){
                this.orderList.push({
                    number:1,
                    id:v.courseId
                })
                total.price += v.discountPrice * v.counter
                total.num = this.select.length
            }
        })
        return total
    }
  },
  actions:{
    // 获取购物车数据
    getCartList(list){
        list.forEach(v=>{
            v['check'] = true
            // 添加前先判断一下是否有重复的，去重
            this.select.push(v.id)
            this.select = [...new Set(this.select)]
        })
        this.cartList = list
    },
    // 全选
    All(){
        this.select = this.cartList.map(v=>{
            v['check'] = true
            return v.id
        })
    },

    // 全不选
    unAll(){
        this.cartList.forEach(v=>{
            v['check'] = false
        })
        this.select = []
    },

    // 单选
    itemSelect(index){
        // 得到当前选中商品的id
        let id = this.cartList[index].id
        // 在select查找
        let idx =  this.select.indexOf(id)
        // console.log(idx)
        if(idx != -1){
            // 找到了【取消选中】
            this.cartList[index].check = false
            this.select.splice(idx,1)
        }else{
            // 没找到【选中】
            this.cartList[index].check = true
            this.select.push(id)
        }
    }

  },
})