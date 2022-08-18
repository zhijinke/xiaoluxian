<template>
    <div class="account-info">
        <!-- 账号信息 -->
        <div class="account">
            <div class="account-left">账号信息</div>
            <div class="account-right">
                <div class="title">完成</div>
                <div class="num">1/4</div>
            </div>
        </div>
        <!-- 信息 -->
        <div class="account-group">
            <div class="account-item" v-for="item in accountList" :key="item.id">
                <!-- 左边 -->
                <div class="item-left">
                    <div class="img">
                        <el-icon size="30px">
                            <component :is="item.icon"/>
                        </el-icon>
                    </div>
                    <div class="content">
                        <div class="content-up">
                            <span class="title">{{item.title}}</span>
                            <span class="phone" v-if="item.tel">{{item.tel}}</span>
                        </div>
                        <div class="content-foot">
                            <span>{{item.brief}}</span>
                        </div>
                    </div>
                </div>
                <!-- 右边[修改绑定] -->
                <div class="item-right">
                    <div class="title">{{item.btn}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// element-ui
import { Iphone,Lock,User,Message } from "@element-plus/icons-vue";
// 账号信息
let accountList = ref([
    {id:1,icon:'Iphone',title:'手机',tel:'15836215044',brief:'可用手机号加密登录小鹿线，可通过手机号找回密码',btn:'修改绑定'},
    {id:2,icon:'Lock',title:'密码',tel:'******',brief:'用于保护账号信息和登录安全',btn:'修改密码'},
    {id:3,icon:'User',title:'用户名',brief:'可用用户名加密码登录小鹿线',btn:'修改用户'},
    {id:4,icon:'Message',title:'邮箱',brief:'可用邮箱加密码登录小鹿线，可用邮箱找回密码',btn:'绑定邮箱'},
])

</script>

<style scoped>
.account-info{
    flex: 1;
    box-sizing: border-box;
    margin: 20px 15px 0 15px;
}
/* 账号信息 */
.account-info .account{
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    border-bottom: 2px solid #d4d4d4;
}
.account .account-left{
    font-size: 18px;
    font-weight: bold;
    color: #333333;
}
.account .account-right{
    display: flex;
}
.account-right .title{
    color: #999;
    margin-right: 5px;
}
.account-right .num{
    color: #388fff;
    font-weight: bold;
}
/* 信息列表 */
.account-info .account-group{
    width: 100%;
}
.account-group .account-item {
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #d4d4d4;
}
.account-group .account-item:last-child{
    border: none;
}
.account-item .item-left{
    display: flex;
}
.item-left .img{
    width: 70px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.item-left .content{
    padding: 18px 0;
    margin: auto 0;
}
.content .content-up{
    font-weight: bold;
    line-height: 30px;
    height: 30px;
}
.content-up .title{
    min-width: 90px;
    max-width: 90px;
    height: 30px;
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    margin-right: 5px;
    display: inline-block;
    text-align: justify;
    letter-spacing:10px;
    white-space: nowrap;
}
.content-up .phone{
    color: #388fff;
}
.content .content-foot{
    color: #666666;
}
/* 修改绑定 */
.account-item .item-right{
    width: 100px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.item-right .title{
    padding: 8px 15px;
    border: 1px solid #666;
    border-radius: 20px;
    color: #666;
    cursor: pointer;
}
.item-right .title:hover{
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
}
</style>