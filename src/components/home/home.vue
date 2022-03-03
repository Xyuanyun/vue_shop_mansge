<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img
              src="../../assets/logo.png"
              alt="无法显示图片"
              class="header-img"
            >
          </div>
        </el-col>
        <el-col
          :span="18"
          class="middle"
        >
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a
              href="#"
              class="loginout"
              @click.prevent="handleSignout()"
            >退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside
        width="200px"
        class="aside"
      >
        <el-menu
        :router="true"
        :unique-opened="true"
        >
          <el-submenu :index="''+i" v-for="(item,i) in menu" :key="i">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item1.path" v-for="(item1,i) in item.children" :key="i">
              <i class="el-icon-success"></i>
              <span>{{item1.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    name:"home",
    data(){
      return{
        menu:[]
      }
    },
    // beforeCreate(){
    //   // 获取token
    //   const token =localStorage.getItem('token')
    //   if(!token){
    //     this.$router.push('/login')
    //   }
    // },
    created() {
      this.getMenuList()
    },
    methods:{
      async getMenuList(){
        // 使用有token 值的header，所以不同权限获取菜单也不同
        const res =await this.$http.get(`menus`)
        this.menu=res.data.data
        // console.log(res);
      },
      handleSignout(){
        // 清楚token
        localStorage.clear()
        this.$message.success('退出成功')
        this.$router.push({name: 'Login'})
      }
    }
}
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
  /* height: 100%; */
}
.header-img {
  height: 60px;
}
.middle {
  /* line-height: 60px; */
  text-align: center;
}
.loginout {
  /* 取消下划线 */
  text-decoration: none;
  line-height: 60px;
}
</style>