<template>
  <div>
      <el-form
      label-position="top" label-width="100px" class="demo-ruleForm"
      :model="rulesForm"
      :rules="rules"
        status-icon
        ref="ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="rulesForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password"  v-model="rulesForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="submitForm()" >登录</el-button>
      </el-form-item>
  
    </el-form>
  </div>
</template>

<script>
export default {
    name:"login",
    data() {
        return {
            rulesForm:{
                username:'admin',
                password:'123456'
            },
            rules:{
                username:[{required:true,message:'请输入名字',trigger:"blur"}],
                password:[{required:true,message:'请输入密码',trigger:"blur"}]
            }
        }
    },
    methods:{
        submitForm(){
            this.$refs.ruleForm.validate((valid)=>{
                if(valid){
                    //异步操作：希望异步操作看起来像同步代码 用ES7 async+await
                    this.$http.post('login',this.rulesForm).then((res)=>{
                        // console.log(res)
                        // 对象结构赋值
                        // 把res.data中data数据赋值给左侧对象中data
                        const {
                            data,meta:{msg,status}
                        }=res.data
                        if(status===200){
                            // 如果没有判断token值，则可以用url直接进去主页；为保证登录成功才能进入主页须先判断token值
                            //  保存登录成功用户后台返回的token值
                            localStorage.setItem('token',data.token)
                            this.$message({
                                // showClose: true,
                                message:msg,
                                type: 'success'
                            });
                            // this.$router.replace('/');
                            this.$router.replace({name: 'Home'});
                        }else{
                            this.$message.error(msg);
                        }
                        // this.$router.replace('/home');
                    })   
                }else{
                    this.$message({
                        showClose: true,
                        message: '请输入用户名和密码',
                        type: 'error'
                    });
                    return false;
                }
            });
        }
    }
}
</script>

<style scoped>
    .demo-ruleForm{
        border-radius: 15px;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px;
        box-shadow: 0 0 25px #cac6c6;
    }
</style>