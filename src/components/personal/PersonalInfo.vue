<template>
  <div class="personal">
        <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
        <el-menu-item index="1" >基本信息</el-menu-item>
        <el-menu-item index="2">联系信息</el-menu-item>
        </el-menu>
        <!-- 基本信息 -->
        <div v-if="currentIndex==1" class="oneIndex">
            <el-form :model="form" label-width="120px">
                <el-form-item label="姓名">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="form.nickName"/>
                </el-form-item>
                <el-form-item label="证件类型">
                    <el-select v-model="form.region" placeholder="请选择你的证件类型">
                        <el-option label="身份证" value="sfz" />
                        <el-option label="居住证" value="jzz" />
                        <el-option label="户口本" value="hkb" />
                        <el-option label="护照" value="hz" />
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码">
                    <el-input v-model="form.id" type="number"/>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="男" />
                        <el-radio label="女" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="最高学历">
                    <el-select v-model="form.education" placeholder="本科">
                        <el-option label="小学" value="xx" />
                        <el-option label="初中" value="cz" />
                        <el-option label="高中" value="gz" />
                        <el-option label="大专" value="dz" />
                        <el-option label="本科" value="bk" />
                        <el-option label="研究生" value="yjs" />
                        <el-option label="博士" value="bs" />
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="form.year" type="number"/>
                </el-form-item>
                <el-form-item label="出生日期">
                <el-col :span="11">
                    <el-date-picker
                    v-model="form.date1"
                    type="date"
                    placeholder="请填写你的出生日期"
                    style="width: 100%"
                    />
                </el-col>
                </el-form-item>
                <el-form-item label="户口所在地">
                    <el-input v-model="form.address"/>
                </el-form-item>
                <el-form-item label="签名">
                <el-input v-model="form.desc" type="textarea" />
                </el-form-item>
                <el-form-item class="last">
                <el-button type="primary" @click="onSubmit">确认</el-button>
                <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 联系信息 -->
        <div v-if="currentIndex==2" class="oneIndex">
            <el-form :model="contact" label-width="120px">
                <el-form-item label="手机号" class="changeBg">
                    <el-input v-model="contact.phone" type="number"/>
                </el-form-item>
                <el-form-item label="邮箱" class="changeBg">
                    <el-input v-model="contact.email" />
                </el-form-item>
                <el-form-item label="座机号">
                    <el-input v-model="contact.zuojihao" type="number"/>
                </el-form-item>
                <el-form-item label="办公电话">
                    <el-input v-model="contact.bangongdianhua" type="number"/>
                </el-form-item>
                <el-form-item label="紧急联系人">
                    <el-input v-model="contact.linkman" />
                </el-form-item>
                <el-form-item label="紧急联系人电话">
                    <el-input v-model="contact.linkmanPhone" type="number"/>
                </el-form-item>
                <el-form-item label="微信">
                    <el-input v-model="contact.wx" />
                </el-form-item>
                <el-form-item label="QQ">
                    <el-input v-model="contact.qq" type="number"/>
                </el-form-item>
                <el-form-item label="省市区">
                    <el-cascader
                        placeholder="请选择地区"
                        size="default"
                        :options="regionData"
                        v-model="contact.selectedOptions"
                        @change="handleChange"
                        >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                <el-input v-model="contact.detailAddress" />
                </el-form-item>
                <el-form-item class="last">
                    <el-button type="primary" @click="onSubmit">确认</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
  </div>
</template>

<script setup>
// api
import {createToken} from '@/utils/api/createToken'
import {update} from '@/utils/api/user'
import {getInfo} from '@/utils/api/login'
//引用 element-china-area-data
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import { regionData } from 'element-china-area-data'
import { reactive } from '@vue/reactivity'
// pinia
import {useUserStore} from '@/store/user'
let router = useRouter()
let userStore = useUserStore()
const activeIndex = ref('1')
let currentIndex = ref('1')
// 基本信息
const form = reactive({
  name: '',
  nickName:'',
  id:'',
  year:'',
  region: '',
  education:'',
  date1: '',
  address:'',
  resource: '',
  desc: '',
  bangongdianhua:''
})
// 联系信息
const contact = reactive({
    phone:'',
    email:'',
    zuojihao:'',
    linkman:'',
    linkmanPhone:'',
    wx:'',
    qq:'',
    detailAddress:'',
    selectedOptions:''
})

// 用户的信息
let userInfo = reactive({})
// 临时token、
let token = ref('')

// 生命周期
onBeforeMount(()=>{
    // 临时token
    createToken().then(res=>{
        token.value = res.data.token
    })
    
    userInfo = JSON.parse(localStorage.getItem('xiaoluxian_user')).userInfo
    if(userInfo){
        // // 基本信息
        form.name = userInfo.realName
        form.nickName = userInfo.nickName
        form.id = userInfo.certificateNumber
        form.education = userInfo.highestEducation
        form.year = userInfo.age
        form.date1 = userInfo.birthday
        form.address = userInfo.residenceAddress
        form.desc = userInfo.personalSignature
        form.resource = userInfo.gender
        if(form.resource==1){
            form.resource = '男'
        }else{
            form.resource = '女'
        }
        // 联系信息
        contact.phone = userInfo.mobile
        contact.email = userInfo.email
        contact.zuojihao = userInfo.telephone
        contact.linkman = userInfo.emergencyContact
        contact.linkmanPhone = userInfo.emergencyContactNumber
        contact.wx = userInfo.wechat
        contact.qq = userInfo.qq
        contact.detailAddress = userInfo.address
    }else{
        // 获取 临时token
    createToken().then(res=>{
        token.value = res.data.token
        // 获取用户信息
        getInfo(token.value).then(res=>{
            userInfo = res.data.data
            // 基本信息
            form.name = userInfo.realName
            form.nickName = userInfo.nickName
            form.id = userInfo.certificateNumber
            form.education = userInfo.highestEducation
            form.year = userInfo.age
            form.date1 = userInfo.birthday
            form.address = userInfo.residenceAddress
            form.desc = userInfo.personalSignature
            form.resource = userInfo.gender
            if(form.resource==1){
                form.resource = '男'
            }else{
                form.resource = '女'
            }
            // 联系信息
            contact.phone = userInfo.mobile
            contact.email = userInfo.email
            contact.zuojihao = userInfo.telephone
            contact.linkman = userInfo.emergencyContact
            contact.linkmanPhone = userInfo.emergencyContactNumber
            contact.wx = userInfo.wechat
            contact.qq = userInfo.qq
            contact.detailAddress = userInfo.address 
            // console.log(contact.selectedOptions)
        })
    })
    }
})

// 点击触发的事件
const handleSelect = (k,p)=>{
    currentIndex.value = k
}

// 联系信息 省市区选择
const handleChange = (v)=>{
    // console.log(v)
}

// 基本信息 点击确定
const onSubmit = () => {
  ElMessageBox.confirm('确定修改个人信息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
    
        if(form.resource=='男'){
            form.resource='1'
        }else{
            form.resource='2'
        }
        update({
            address: contact.detailAddress,//详情地址
            id: userInfo.id,
            realName: form.name,//真实姓名
            password: userInfo.password,
            emergencyContactNumber: contact.linkmanPhone,//紧急联系人电话
            emergencyContact: contact.linkman,//紧急联系人
            officeTelephone: contact.bangongdianhua,//办公电话
            personalSignature: form.desc,//个性签名
            highestEducation: form.education,//最高学历
            residenceAddress: form.address,//户籍地址
            certificateType: form.region,//证件类型
            certificateNumber: form.id,//证件号
            ext01: userInfo.ext01,
            ext02: userInfo.ext02,
            ext03: userInfo.ext03,
            username: userInfo.username,//用户名
            birthday: form.year,//生日
            county: userInfo.county,//县
            nickName: form.nickName,//昵称
            gender: form.resource,//性别（1：男；2：女）
            qq: contact.qq,//QQ号
            age: form.year,//年龄
            city: userInfo.city,//城市
            telephone: contact.zuojihao,//座机号
            isEnable: userInfo.isEnable,//是否启用（1：启用；0禁用）
            province: userInfo.province,//省
            mobile: contact.phone,//手机号
            email: contact.email,//邮箱
            wechat: contact.wx,//微信
            avatar: userInfo.avatar,//头像
        },token.value).then(res=>{
            console.log(res)
            if(res.meta.code=='200'){
                router.go(0)
                ElMessage.success({
                    message: '修改个人信息成功!'
                });
            }
        })
    

    }).catch(() => {
      ElMessage.info({
        message: '已取消'
      });
    });
}

</script>

<style scoped>
.personal{
    flex: 1;
    box-sizing: border-box;
    margin: 20px 15px 0 15px;
}
.oneIndex{
    padding: 15px 0;
}
::v-deep el-form-item{
    height: 35px;
    margin-bottom: 16px;
}
::v-deep .el-form-item__label{
    margin-right: 10px;
    font-size: 16px;
}
::v-deep .el-form-item__content{
    width: 300px;
}
::v-deep .el-input{
    width: 300px;
}
::v-deep .el-form-item__label{
    white-space: nowrap;
}
::v-deep .last .el-form-item__content{
    justify-content: center;
}
::v-deep .changeBg .el-input__wrapper{
    background-color: #e9ecef;
}
</style>