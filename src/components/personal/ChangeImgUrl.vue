<template>
  <div class="userImg">
        <div class="account">
            <div class="account-left">上传头像</div>
        </div>
        <div class="circle-main">
          <!-- 左边 -->
          <div class="left">
            <div class="left-content">
              <div class="block">
                <el-avatar shape="square" :size="320" :src="squareUrl" />
              </div>
            </div>
            <div class="btn">
                <el-button type="primary" @click="sureUpload">确认</el-button>
                <el-button type="info" @click="cancleSelect">取消</el-button>
            </div>
          </div>
          <!-- 右边 -->
          <div class="right">
            <div class="block">
              <el-avatar :size="200" :src="circleUrl" />
              <div class="btn">
                <el-upload
                  class="upload-demo"
                  action=""
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :limit="1"
                  :auto-upload="false"
                  :on-exceed="handleExceed"
                  :on-change="changeUpload"
                  accept=".jpg, .png, .jpeg"
                  :show-file-list="false"
                >
                  <el-button type="primary">选择头像</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      jpg/png files with a size less than 500KB.
                    </div>
                  </template>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script setup>
// api
import {update,checkUsername} from '@/utils/api/user'
import {createToken} from '@/utils/api/createToken'
import {getInfo} from '@/utils/api/login'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { onBeforeMount, onBeforeUpdate, reactive } from '@vue/runtime-core'
// pinia
import {useUserStore} from '@/store/user'
let userStore = useUserStore()
let router = useRouter()

// 用户的信息
let user = reactive({})

// 用户的头像
let circleUrl = ref('')
// 本地上传的头像
let squareUrl = ref('')

// 生命周期
onBeforeMount(()=>{
  user = JSON.parse(localStorage.getItem('xiaoluxian_user')).userInfo
  // console.log(user)
  if(user){
    circleUrl.value = user.avatar
    squareUrl.value = user.avatar
  }else{
    getUserInfo()
  }
})

// 获取头像和用户信息
const getUserInfo = ()=>{
  // 获取 临时token
    createToken().then(res=>{
        let token = res.data.token
        // 获取用户信息
        getInfo(token).then(res=>{
          circleUrl.value = res.data.data.avatar
          squareUrl.value = res.data.data.avatar
          user = res.data.data
        })
    })
}

// 点击删除的文件
const handleRemove = (file, uploadFiles) => {
  // console.log(file, uploadFiles)
}

// 点击选中图片的信息时
const handlePreview = (file) => {
  // console.log(file.url)
}

// 当超过限制时
const handleExceed = (files, uploadFiles) => {
    ElMessage.warning({
        message: '只能选择一张图片!'
    });
}
// 点击图片删除时
const beforeRemove = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `是否删除 ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}

// 图片更新时
const changeUpload = (file, fileList)=>{
  let fileName = file.name;
  let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
  if (regex.test(fileName.toLowerCase())) {
    squareUrl.value = URL.createObjectURL(file.raw)  // 获取URL
  } else {
    ElMessage.warning({
        message: '请选择图片文件!'
    });
    return;
  }
}

// 修改头像 [确认上传]
const sureUpload = ()=>{
  if(user.avatar==squareUrl.value){
    ElMessage.warning({
        message: '您还没有选择新头像!'
    });
    return;
  }else{
    ElMessageBox.confirm('确定要修改头像吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
        createToken().then(res=>{
        let token = res.data.token
        getInfo(res.data.token).then(res=>{
          // 用户信息
          let userInfo = res.data.data
          update({
              address: userInfo.address,//详情地址
              id: userInfo.id,
              realName: userInfo.realName,//真实姓名
              password: userInfo.password,
              emergencyContactNumber: userInfo.emergencyContactNumber,//紧急联系人电话
              emergencyContact: userInfo.emergencyContact,//紧急联系人
              officeTelephone: userInfo.officeTelephone,//办公电话
              personalSignature: userInfo.personalSignature,//个性签名
              highestEducation: userInfo.highestEducation,//最高学历
              residenceAddress: userInfo.residenceAddress,//户籍地址
              certificateType: userInfo.certificateType,//证件类型
              certificateNumber: userInfo.certificateNumber,//证件号
              ext01: userInfo.ext01,
              ext02: userInfo.ext02,
              ext03: userInfo.ext03,
              username: userInfo.username,//用户名
              birthday: userInfo.birthday,//生日
              county: userInfo.county,//县
              nickName: userInfo.nickName,//昵称
              gender: userInfo.gender,//性别（1：男；2：女）
              qq: userInfo.qq,//QQ号
              age: userInfo.age,//年龄
              city: userInfo.city,//城市
              telephone: userInfo.telephone,//座机号
              isEnable: userInfo.isEnable,//是否启用（1：启用；0禁用）
              province: userInfo.province,//省
              mobile: userInfo.mobile,//手机号
              email: userInfo.email,//邮箱
              wechat: userInfo.wechat,//微信
              avatar: squareUrl.value,//头像
          },token).then(res=>{
              console.log(res)
              if(res.meta.code=='200'){
                  router.go(0)
                  ElMessage.success({
                    message: '修改头像成功'
                  });
              }
          })
        })
      })
    }).catch(() => {
      ElMessage.info({
        message: '已取消'
      });
    });
  }
   
}

// 取消选中的头像
const cancleSelect = ()=>{
  if(user.avatar==squareUrl.value){
    ElMessage.warning({
        message: '您还没有选择新头像!'
    });
    return;
  }else{
    squareUrl.value = user.avatar
    return;
  }
}


</script>

<style scoped>
.userImg{
    flex: 1;
    box-sizing: border-box;
    margin: 20px 15px 0 15px;
}
.userImg .account{
    height: 40px;
    line-height: 40px;
    border-bottom: 2px solid #d4d4d4;
}
.userImg .account-left{
    font-size: 18px;
    font-weight: bold;
    color: #333333;
}
/* 头像部分 */
.circle-main{
  margin-top: 30px;
  display: flex;
}
.circle-main .left{
  width: 60%;
  /* border: 1px solid black; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left .left-content{
  width: 80%;
  height: 320px;
  
  box-sizing: border-box;
  /* border: 1px solid red; */
}
.left .btn{
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.circle-main .right{
  flex: 1;
  /* border: 1px solid red; */
}
.right{
    display: flex;
    justify-content: center;
    /* align-items: center; */
}
.block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.block ::v-deep .el-avatar{
  display: flex;
  justify-content: center;
}  
.block .btn .upload-demo{
  margin-top: 30px;
  display: flex;
  flex-direction: column;
}
</style>