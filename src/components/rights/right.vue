<template>
    <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="权限列表" class="bread"></my-bread>
    <!-- 表格 -->
    <el-table
    :data="rightlist"
    border
    height="400px"
    style="width: 100%">
    <el-table-column
        type="index"
        label="#"
        width="100"
      ></el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="200">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径"
      width="200">
    </el-table-column>
    <el-table-column label="层级">
      <template slot-scope="scope">
        <span v-show="scope.row.level==='0'">一级</span>
        <span v-show="scope.row.level==='1'">二级</span>
        <span v-show="scope.row.level==='2'">三级</span>
      </template>
    </el-table-column>
  </el-table>
    </el-card>
</template>

<script>
export default {
    name:'right',
    data(){
        return{
            rightlist:[],
        }
    },
    created(){
        this.getRightlist();
    }
    ,
    methods:{
        async getRightlist(){
            // 请求头中Authorization设置
            const res=await this.$http.get(`rights/list`)
            // console.log(res)
            this.rightlist=res.data.data
        }
    }
}
</script>

<style scoped>
.bread{
  margin-bottom: 10px;
}
</style>
