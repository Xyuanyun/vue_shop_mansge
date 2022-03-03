<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row>
      <el-col>
        <el-input
          clearable
          @clear="loadUserList()"
          placeholder="请输入内容"
          v-model="query"
          class="search-input"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchUser()"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="userlist"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="#"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
      ></el-table-column>
      <!-- 处理数据格式用过滤器 >main.js中写了一个全局的过滤器-->
      <!-- <el-table-column prop="create_time" label="创建时间"></el-table-column> -->
      <!-- 如果在表格中展示非文本数据，须在内层增加小容器，用slot-scope引入外层数据，userlist.row指向数据数据中每个对象 -->
      <!-- slot-scope会自动去找上一级所绑定的数据 -->
      <el-table-column label="创建时间">
        <template slot-scope="userlist">{{userlist.row.create_time | fmtdata}}
        </template>
      </el-table-column>

      <el-table-column
        label="用户状态"
      >
        <template slot-scope="userlist">
          <el-switch
            v-model="userlist.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserMg(userlist.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="13"
        label="操作"
      >
       <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle
           @click="showEditMsgBox(scope.row)"
          ></el-button>
          <el-button size="mini" plain type="danger" 
             icon="el-icon-delete" circle 
            @click="showDeleteMsgBox(scope.row.id)">
          </el-button>
          <el-button 
          size="mini" plain type="success"
          icon="el-icon-check" circle
          @click="showSetRoleBox(scope.row)"
          ></el-button>
       </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
  <el-form :model="form">
    <el-form-item label="用户名" label-width="100px">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" label-width="100px">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" label-width="100px">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" label-width="100px">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
  </div>
</el-dialog>
<!-- 编辑对话框 -->
<el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
  <el-form :model="form">
    <el-form-item  label="用户名" label-width="100px">
      <el-input disabled="false" v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" label-width="100px">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" label-width="100px">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click="editUser()">确 定</el-button>
  </div>
</el-dialog>
<!-- 设置用户角色 -->
<el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
  <el-form :model="form">
    <el-form-item label="用户名" label-width="100px">
      {{currUserName}}
    </el-form-item>
    <el-form-item label="角色" label-width="100px">
      <el-select v-model="currRoleId">
        <el-option label="请选择" :value="-1"></el-option>
        <el-option :label="item.roleName" :value="item.id" v-for="(item, i) in roles" :key="i"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
    <el-button type="primary" @click="setRole()">确 定</el-button>
  </div>
</el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'users',
  data(){
    return{
      query:'',
      userlist: [],
      // 分页数据
      total:-1,
      pagenum:1,
      pagesize:2,
      // 添加对话框属性
      dialogFormVisibleAdd:false,
      dialogFormVisibleEdit:false,
      dialogFormVisibleRole:false,
      form:{
        username:'',
        password:'',
        mobile:'',
        email:''
      },
      currRoleId:-1,
      currUserId:-1,
      currUserName:'',
      roles:[]
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      // 请求头中Authorization设置
      // const AUTH_TOKEN=localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res =await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res);
      const {data:{users,total},meta:{msg,status}}=res.data
      if(status===200){
        this.userlist=users
        this.total=total
        this.$message.success(msg)
      }else{
        this.$message.warning(msg)
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize=val
      // this.pagenum=1s
      this.getUserList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum=val
      this.getUserList()
    },
    searchUser(){
      // query双向绑定
      this.getUserList()
    },
    loadUserList(){
      this.getUserList()
    },
    showAddUserDia(){
      this.form={}
      this.dialogFormVisibleAdd=true
    },
    async addUser(){
      // const AUTH_TOKEN=localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res=await this.$http.post(`users`,this.form)
      // console.log(res);
      const{meta:{status,msg},data}=res.data
      if(status===201){
        this.$message.success(msg)
        this.getUserList()
        // 清空文本框
        this.form={}
      }else{
        this.$message.success(msg)
      }
      this.dialogFormVisibleAdd=false
    },
    showDeleteMsgBox(userid){
      this.$confirm('删除用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送删除请求
          const res=await this.$http.delete(`users/${userid}`)
          if(res.data.meta.status===200){
            this.getUserList()
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            });
          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    showEditMsgBox(user){
      this.form=user;
      this.dialogFormVisibleEdit=true;
    },
    async editUser(){
      const res =await this.$http.put(`users/${this.form.id}`,this.form)
      if(res.data.meta.status==200){
        this.getUserList()
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        });
        
      }else{
        this.$message({
          type: 'waining',
          message: res.data.meta.msg
        });
      }
      this.dialogFormVisibleEdit=false
    },
    async changeUserMg(user){
      const res=await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
    },
    async showSetRoleBox(user){
      this.dialogFormVisibleRole=true
      this.currUserName=user.username
      this.currUserId=user.id
      const res= await this.$http.get(`users/${user.id}`)
      // console.log(res.data.data.rid)
      this.currRoleId=res.data.data.rid;
      
      // 获取所有角色的名称
      const res1=await this.$http.get(`roles`)
      console.log(res1.data)
      this.roles=res1.data.data;
    },
    async setRole(){
      this.dialogFormVisibleRole = false
      const res =await this.$http.put(`users/${this.currUserId}/role`,{
        rid:this.currRoleId
      })
      // this.dialogFormVisibleAdd=false
    }
  }
}
</script>

<style scoped>
.box-card {
  height: 100%;
}
.breadcrumb {
  margin-bottom: 10px;
}
.search-input {
  width: 400px;
}
</style>