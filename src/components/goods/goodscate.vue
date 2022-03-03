<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread
      level1="商品管理"
      level2="商品分类"
      class="bread"
    ></my-bread>
    <el-button type="success" @click="showAddCateDia()" class="addbtn">添加分类</el-button>
    <!-- 表格 -->
    <el-table
      :data="catelist"
      height="400px"
      style="width: 100%"
    >
      <el-tree-grid prop="cat_name" label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        fileIcon="">
      </el-tree-grid>
      <el-table-column
        label="级别"
        width="180"
      >
        <template slot-scope="scope">
        <span v-show="scope.row.cat_level===0">一级</span>
        <span v-show="scope.row.cat_level===1">二级</span>
        <span v-show="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效"
        width="180"
      >
        <template slot-scope="scope">
        <span v-show="scope.row.cat_deleted===false">无效</span>
        <span v-show="scope.row.cat_deleted===true">有效</span>
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
            @click="showDeleteMsgBox(scope.row)">
          </el-button>
       </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[4, 6, 8,10]"
      :page-size="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
  <el-form :model="form">
    <el-form-item label="分类名称" label-width="100px">
      <el-input v-model="form.cat_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="分类" label-width="100px">
      <el-cascader
        clearable
        v-model="selectedOptions"
        :options="options"
        :props="defaultProp"
        @change="handleChange"></el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="addCate()">确 定</el-button>
  </div>
</el-dialog>

  </el-card>
</template>

<script>
// 引入element-tree-grid
var ElTreeGrid = require('element-tree-grid');
export default {
  components:{
    ElTreeGrid
  },
  data(){
    return{
      query:'',
      catelist: [],
      // 分页功能
      total:-1,
      pagenum:1,
      pagesize:4,
      // 添加分类
      dialogFormVisibleAdd:false,
      form:{
        cat_name:'',
        cat_pid:-1,
        cat_level:-1
      },
      selectedOptions:[],
      options:[],
      defaultProp:{
        label:'cat_name',
        value:'cat_id',
        children:'children',
        expandTrigger:'hover'
        },
    }
  },
  created(){
    this.getcateList()
    // this.getGoodCate()
  },
  methods:{
    // 获取商品数据
    async getcateList(){
      // 请求头中Authorization设置
      // const AUTH_TOKEN=localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res =await this.$http.get(
        `categories?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res);
      const {data:{result,total},meta:{msg,status}}=res.data
      if(res.data.meta.status===200){
        this.catelist=result
        this.total=total
      }
      console.log(this.catelist)
    },
    // 分页功能
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize=val
      // this.pagenum=1s
      this.getcateList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum=val
      this.getcateList()
    },
    // 添加分类
    async showAddCateDia(){
      this.form={}
      this.dialogFormVisibleAdd=true;
      const res=await this.$http.get(`categories?type=2`)
      this.options=res.data.data
    },
    async addCate(){
      if(this.selectedOptions.length===0){
        this.form.cat_pid=0
        this.form.cat_level=0
      }else if(this.selectedOptions.length===1){
        this.form.cat_pid=this.selectedOptions[0]
        this.form.cat_level=1
      }else{
        this.form.cat_pid=this.selectedOptions[1]
        this.form.cat_level=2
      }
      const res =await this.$http.post(`categories`,this.form)
      console.log(res)
      this.dialogFormVisibleAdd=false
    },
  }
}
</script>

<style scoped>
.addbtn{
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>