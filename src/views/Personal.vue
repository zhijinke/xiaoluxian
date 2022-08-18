<template>
    <Header></Header>
    <div class="personal-main">
        <div class="content">
            <!-- 左边 -->
            <div class="left">
                <div class="left-main">
                    <div class="left-content">
                        <!-- 头像用户名 -->
                        <div class="top">
                            <div class="top-main">
                                <div class="top-img">
                                    <img :src="userImg" alt="用户头像" title="用户头像">
                                </div>
                                <p class="name">{{nickName}}</p>
                                <p class="id">{{personalSignature}}</p>
                            </div>
                        </div>
                        <div class="content">
                            <div class="content-main">
                                <div class="title">账号管理</div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="list-group">
                                <div 
                                class="list" 
                                :class="currentId == item.id ?'active':''"
                                @click="changeView(item.id)" v-for="item in account" 
                                :key="item.id">
                                    <div class="list-left">{{item.name}}</div>
                                    <el-icon :color="currentId==item.id?'#FFF':'#000'"><ArrowRight /></el-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 右边【组件】 -->
            <AccountInfo v-if="currentId==1"></AccountInfo>
            <PersonalInfo v-if="currentId==2"></PersonalInfo>
            <ChangeImgUrl v-if="currentId==3"></ChangeImgUrl>
        </div>
    </div>
    <Footer></Footer>
</template>

<script setup>
//引入组件
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import AccountInfo from '@/components/personal/AccountInfo.vue'
import PersonalInfo from '@/components/personal/PersonalInfo.vue'
import ChangeImgUrl from '@/components/personal/ChangeImgUrl.vue'
// element-ui
import { ArrowRight } from "@element-plus/icons-vue";
import { onBeforeMount, reactive } from '@vue/runtime-core'
// api
import {createToken} from '@/utils/api/createToken'
import {getInfo} from '@/utils/api/login'

// 账号管理数据
let account = ref([
    {id:1,name:'账号信息'},
    {id:2,name:'个人信息'},
    {id:3,name:'修改头像'},
])
// 点击加上class类
let currentId = ref(1)

// 用户数据
let userInfo = reactive({})
// 用户名称
let nickName = ref('')
// 用户头像
let userImg = ref('')
// 用户个性签名
let personalSignature = ref('')

// 点击切换右边的视图
const changeView = (id)=>{
    currentId.value = id
    
}

// 生命周期
onMounted(()=>{
   let user = JSON.parse(localStorage.getItem('xiaoluxian_user')).userInfo
    if(user){
        userInfo = user
        nickName.value = userInfo.nickName
        userImg.value = userInfo.avatar
        personalSignature.value = userInfo.personalSignature
    }else{
        // 获取 临时token
        createToken().then(res=>{
            token.value = res.data.token
            // 获取用户信息
            getInfo(token.value).then(res=>{
                userInfo = res.data.data
            })
        })
    }
})

// // 防止刷新重置
// watch(()=>{
//     // console.log(currentId.value)
//     if(changeNum.value == 1){
//         currentId.value = 1
//     }else if(changeNum.value==2){
//         currentId.value = 2
//     }else if(changeNum.value==3){
//         currentId.value = 3
//     }
// },{immediate:true})

</script>

<style scoped>
.personal-main{
    width: 1000px;
    margin: 0 auto;
}
.personal-main .content{
    width: 100%;
    display: flex;
}
.content .left{
    width: 292.5px;
    height: 600px;
    margin: 20px 0;
    padding: 0 15px;
    box-sizing: border-box;
}
.content .left .left-main{
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: rgba(249, 250, 252, 1);

}
.left-content{
    width: 100%;
    height: 100%;
}
/* 头像部分 */
.left-content .top{
    width: 100%;
    height: 158px;
    margin-bottom:20px ;
}
.top .top-main{
    width: 150px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.top .top-main .top-img{
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
}
.top .top-main .top-img img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid rgba(249, 250, 252, 1);
    box-sizing: border-box;
}
.top .top-main .name{
    font-size: 16px;
    font-weight: 400;
    color: #1c1f21;
    margin: 8px 0;
}
.top .top-main .id{
    color: #999;
    white-space: nowrap;
    overflow: hidden;
}
/* 账号管理部分 */
.left-content .content{
    width: 100%;
    padding-bottom: 20px;
}
.content .content-main{
    height: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.content .content-main .title{
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
    color: #1c1f21;
    border-bottom: 1px solid rgba(112, 112, 112, 0.5);
}
/* 账号信息部分 */
.left-content .bottom{
    width: 100%;
}
.left-content .bottom .list-group{
    width: 100%;
}
.left-content .bottom .list-group .list{
    width: 100%;
    height: 45px;
    padding: 12px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}
.active{
    background: #388fff;
    color: #FFF;
}
</style>