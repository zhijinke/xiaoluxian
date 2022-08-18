<template>
    <header @mouseleave='isShow=false'>
        <div class="header-main">
            <div class="header-left">
                <h1 class="logo">
                    <img src="@/assets/img/logo.png" />
                </h1>
                <ul>
                    <li 
                    v-for="item in list" :key="item.id"
                    :class=" currentId == item.id ? 'active':'' "
                    @click="showActive(item.id,item.path)"
                    >
                    {{item.name}}</li>
                </ul>
            </div>
            <div class="header-right">
                <div class="search">
                    <input type="text">
                    <el-icon color='#999' :size='20'><Search /></el-icon>
                </div>
                <div class="shop" >
                    <el-icon :size='20' @click="goCart"><ShoppingCart /></el-icon>
                </div>
                <div class="login" v-if="!isLogin">
                    <router-link to="/login">登录/注册</router-link>
                </div>
                <div class="content-login-success" v-else >
                  <div style="cursor: pointer" class="myClass">我的课程</div>
                  <div @mouseenter='isShow=true'>
                    <img
                      class="avator"
                      :src="userInfo.avatar"
                      alt=""
                      v-if="userInfo.avatar"
                    />
                    <img v-else class="avator" src='../../assets/img/Avat62.png'/>
                  </div>
				        </div>
            <!-- </div> -->
            <!-- 划过头像显示  -->
                <div class="user-info" v-if='isShow'>
                  <div class="user-info-top">
                    <div class="u-i-t-top">
                      <img
                        class="avator"
                        :src="userInfo.avatar"
                        alt=""
                        v-if="userInfo.avatar"
                      />
                      <img class="avator" src='../../assets/img/Avat62.png' v-else />
                      <div class="avator-info">
                        <p>{{userInfo.nickName}}</p>
                      </div>
                      <div class="vip" v-if="vipInfo">
                        <div class="vipImg">
                          <img :src="vipInfo.vipIcon" :class="endTimeVip < 0 ? 'gray':''">
                        </div>
                        <div class="vipName">{{vipInfo.vipName}}</div>
                        <div class="endTime" v-if="vipInfo.isExpired === 0 ">{{endTimeVip}}天到期</div>
                        <div class="endTime" v-else>已过期{{Math.abs(endTimeVip)}}天</div>
                      </div>
                    </div>
                    <div class="u-i-i-bottom">
                      <div>
                        <router-link to="/">
                          <div class="info-item">
                            <img src="../../assets/img/course.png"/>
                            <p>我的课程</p>
                          </div>
                        </router-link>
                      </div>
                      <div>
                        <router-link to="/">
                          <div class="info-item">
                            <img src="../../assets/img/order.png" />
                            <p>订单中心</p>
                          </div>
                        </router-link>
                      </div>
                      <div>
                        <router-link to="/">
                          <div class="info-item">
                            <img src="../../assets/img/mess.png"/>
                            <p>我的消息</p>
                          </div>
                        </router-link>
                      </div>
                      <div>
                        <router-link to="/personal">
                          <div class="info-item">
                            <img src="../../assets/img/setting.png"/>
                            <p>个人设置</p>
                          </div>
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div class="user-info-bottom" >
                    <div class="logout" @click="outLogin">退出登录</div>
                  </div>
                </div>
				    </div>
			</div>
    </header>
</template>

<script setup>
// store
// import {useUserStore} from '@/store/user'
//element
import { Search , ShoppingCart } from '@element-plus/icons-vue'
import { onBeforeMount, watch } from '@vue/runtime-core'
// api 请求临时token
import {createToken} from '@/utils/api/createToken'
// 请求用户信息
import {getInfo,logout} from '@/utils/api/login';
// 引入router
const router = useRouter()

// 头部循环数据
const list = ref([
    {id:0,name:'首 页',path:'/'},
    {id:1,name:'课 程',path:'/course'},
    {id:2,name:'会 员',path:'/vip'}
])
// 初识数据 【点击加上active类】
const currentId = ref(0)
// 是否显示用户信息
let isLogin = ref(false)
// 用户的信息
let userInfo = ref({})
// 用户vip情况
let vipInfo = ref({})
// vip到期时间
let endTimeVip = ref()
// 鼠标移入显示隐藏
let isShow = ref(false)

// 点击加上active类
const showActive = (id,path)=>{
    currentId.value = id
    router.push({
        path:path
    })
}
// console.log(router.currentRoute.value.name)
watch(()=>router.currentRoute.value.name,(toPath)=>{
    if(toPath=='Home'){
        currentId.value = 0
    }else if(toPath=="Course"){
        currentId.value = 1
    }else if(toPath=="Vip"){
        currentId.value = 2
    }else{
      currentId.value = -1
    }
},{immediate:true})

// 生命周期
onBeforeMount(()=>{
    // 请求临时token
    createToken().then(res=>{
        let token = res.data.token
        getInfo({
            token
        }).then(res=>{
            if(res.meta.code==200){
                // 用户信息
                userInfo.value = res.data.data
                useUserStore().userInfo = res.data.data
                // 用户vip情况
                vipInfo.value = res.data.data.vipInfo
                // vip到期时间
                let now = new Date().getTime()
                let endTime = vipInfo.value.endTime
                endTimeVip.value = Math.floor((endTime-now)/1000/60/60/24)
                isLogin.value = true
                // console.log(res.data.data.vipInfo)
            }
        })
    })
})

// pinia
import {useUserStore} from '@/store/user'
//element-plus
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
// 退出登录
const outLogin = ()=>{
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
        logout().then(res=>{
            if(res.meta.code=='200'){
                // 清除本地token
                let userStore = useUserStore()
                userStore.clearToken()
                // 刷新页面
                router.go(0)
                ElMessage.success({
                    message: '退出成功!'
                });
            }
        })
        
    }).catch(() => {
      ElMessage.info({
        message: '已取消'
      });
    });
}

// 跳转到购物车
const goCart = ()=>{
  router.push({
    path:'/cart'
  })
}


</script>

<style scoped>
.content-login-success .myClass{
    padding:0 21px ;
}
    .header{
        position: relative;
        z-index: 999;
        width: 100%;
        height: 80px;
        box-shadow: 0px 2px 4px rgba(0,0,0,0.1600);
    }
    .header-main{
        width: 1000px;
        height: 80px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* background: #bfa; */
    }
    .header-main .header-left{
        display: flex;
        align-items: center;
    }
    .header-main .header-left .logo{
        width: 127px;
        height: 50px;
        margin-right: 51px;
    }
    .header-main .header-left .logo img{
        width: 100%;
        height: 100%;
    }
    .header-main .header-left ul {
        display: flex;
        align-items: center;
    }
    .header-main .header-left ul li{
        height: 80px;
        line-height: 80px;
        box-sizing: border-box;
        font-weight: 500; 
	    cursor: pointer;
        font-size: 18px;
        color: #808080;
    }
    .header-main .header-left ul li + li{
        margin-left: 60px;
        /* font-size: 16px; */
        
    }
    .header-main .header-right{
        display: flex;
        align-items: center;
    }
    .header-right .search{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        width: 300px;
        height: 43px;
        background: #F0F2F4;
        border-radius: 5px;
    }
    .header-right .search input{
        width: 270px;
        height: 43px;
        border: none;
        background: transparent;
        outline: none;
    }
    .header-right .shop{
	display: flex;
	align-items: center;
	margin-left: 21px;
  cursor: pointer;
    }
    .header-right .login a{
	margin-left: 39px;
	font-size: 16px;
	color: #808080;
	cursor: pointer;
    text-decoration: none;
    }
    .active{
        color: #3585FF !important;
        border-bottom: 3px solid #3585FF;
        display: flex;
        /* position: relative; */
    }
    /* .active:after{
        content: '';
        position: absolute;
        bottom: 0;
	    left: 0;
        width: 140%;
        margin-left: -20%;
        height: 3px;
        background: #3585FF;
    } */
    .content-login-success {
	height: 53px;
	color: #808080;
	text-align: center;
	width: 180px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 18px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #707070;
}
.avator {
	height: 53px;
	width: 53px;
	cursor: pointer;
	border-radius: 50%;
}
.user-info {
	width: 200px;
	height: 194px;
	background-color: #fff;
	border: 1px solid rgba(248, 250, 252, 1);
	box-shadow: 0px 5px 15px 3px #888888;
	position: absolute;
	top: 80px;
	right: 12%;
	z-index: 999;
	display: block;
	border-radius: 10px;
}
.user-info-top {
	display: flex;
	width: 100%;
	height: 160px;
	border-bottom: 1px solid rgba(248, 250, 252, 1);
	flex-direction: column;
}
.u-i-t-top {
	display: flex;
	height: 80px;
	width: 100%;
	align-items: center;
}
.u-i-t-top img {
	width: 40px;
	height: 40px;
	margin: 0 10px;
	cursor: pointer;
}
.avator-info {
	width: 120px;
	height: 60px;
	font-size: 14px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
	display: flex;
	flex-direction: column;
	/*align-items: center;*/
}
/*有会员了之后高度微调*/
.avator-info p {
	height: 40px;
	line-height: 40px;
	cursor: pointer;
}
.u-i-i-bottom {
	display: flex;
	height: 100px;
	width: 200px;
	margin-top: 10px;
	flex-wrap: wrap;
	justify-content: space-around;
}
.u-i-i-bottom a{
	text-decoration: none;
}
.info-item {
	width: 90px;
	height: 30px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
	border-radius: 3px;
	cursor: pointer;
	background-color: rgba(0, 0, 0, 0.1) !important;
}
.info-item img {
	width: 14px;
	height: 16px;
}
.user-info-bottom {
	position: relative;
	width: 100%;
	height: 30px;
}
.logout {
	line-height: 30px;
	position: absolute;
	top: 0;
	right: 10px;
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #93999f;
	cursor: pointer;
}
/*vip开始*/
.vip{
  display: flex;
  flex-direction: row;
  /*flex-wrap: wrap;*/
  width: 100%;
  height: 30px;
  margin-left: -105px;
  margin-top: 18px;
  font-size: 12px;
  line-height:30px;
}
.vipImg{
  width: 15px;
  height: 15px;
  margin-right: 12px;
}
.vipImg img{
  width: 100% !important;
  height: 100% !important;
}
.vipName{
  color: #93999F;
}
.endTime{
  padding-left: 2px;
  color:#FF0000 ;
  position: absolute;
  top: 45px;
  left: 73px;
  font-size: 12px;
}
</style>