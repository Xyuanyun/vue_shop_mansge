<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表" class="bread"></my-bread>
    <!-- 搜索 -->
    <el-row>
      <el-col>
        <el-input
          clearable
          @clear="loadGoodList()"
          placeholder="请输入内容"
          v-model="query"
          class="search-input"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchGood()"
          ></el-button>
        </el-input>
        <el-button type="success" @click="$router.push('/goodsadd')">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="goodlist"
      style="width: 100%"
      height="400"
    >
      <el-table-column
        type="index"
        label="#"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="300"
      ></el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
      ></el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
      ></el-table-column>
      <!-- 处理数据格式用过滤器 >main.js中写了一个全局的过滤器-->
      <!-- <el-table-column prop="create_time" label="创建时间"></el-table-column> -->
      <!-- 如果在表格中展示非文本数据，须在内层增加小容器，用slot-scope引入外层数据，userlist.row指向数据数据中每个对象 -->
      <!-- slot-scope会自动去找上一级所绑定的数据 -->
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{scope.row.create_time | fmtdata}}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
      >
       <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle
           @click="showEditMsgBox(scope.row)"
          ></el-button>
          <el-button size="mini" plain type="danger" 
             icon="el-icon-delete" circle 
            @click="showDeleteMsgBox(scope.row.goods_id)">
          </el-button>
          
       </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[100, 200, 400, 500]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 对话框 -->
    
<!-- 编辑对话框 -->
<el-dialog title="编辑商品" :visible.sync="dialogFormVisibleEdit">
  <el-form :model="form">
    <el-form-item  label="商品名称" label-width="100px">
      <el-input disabled="false" v-model="form.goods_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="价格" label-width="100px">
      <el-input v-model="form.goods_price" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="数量" label-width="100px">
      <el-input v-model="form.goods_number" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="重量" label-width="100px">
      <el-input v-model="form.goods_weight" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click="editGood()">确 定</el-button>
  </div>
</el-dialog>
<!-- 设置用户角色 -->

  </el-card>
</template>

<script>
export default {
//   name: 'users',
  data(){
    return{
      query:'',
      goodlist: [],
      // 分页数据
      total:-1,
      pagenum:1,
      pagesize:100,
      // 添加对话框属性
      dialogFormVisibleAdd:false,
      dialogFormVisibleEdit:false,
      dialogFormVisibleRole:false,
      form:{
        goods_name:'',
        goods_price:'',
        goods_number:'',
        goods_weight:'',
        goods_introduce:'',
        pics:{},
        attrs:[]
      },
      currRoleId:-1,
      currUserId:-1,
      currUserName:'',
      roles:[]
    }
  },
  created(){
    this.getGoodList()
  },
  methods:{
    async getGoodList(){
      // 请求头中Authorization设置
      // const AUTH_TOKEN=localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res =await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res);
      const {data:{goods,total},meta:{msg,status}}=res.data
      if(status===200){
        this.goodlist=goods
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
      this.getGoodList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum=val
      this.getGoodList()
    },
    // 搜索框
    searchGood(){
      // query双向绑定
      this.getGoodList()
    },
    loadUserGood(){
      this.getGoodList()
    },
    
    showDeleteMsgBox(goodid){
      this.$confirm('删除商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送删除请求
          const res=await this.$http.delete(`goods/${goodid}`)
          if(res.data.meta.status===200){
            this.getGoodList()
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
    showEditMsgBox(good){
      this.form=good;
      this.dialogFormVisibleEdit=true;
      console.log(this.form)
    },
    async editGood(){
      
      const res =await this.$http.put(`users/${this.form.id}`,this.form)
      if(res.data.meta.status==200){
        this.getGoodList()
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