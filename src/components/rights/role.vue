<template>
    <el-card>
      <!-- 面包屑 -->
      <my-bread level1="权限管理" level2="角色列表"></my-bread>
      <el-button type="info" plain class="addrolebtn" @click="showAddRoleDia()">添加角色</el-button>
      <!-- 表格 -->
      <el-table
    :data="rolelist"
    style="width: 100%">
    <el-table-column
        type="expand"
        width="60"
      >
      <template slot-scope="scope">
          <span v-show="scope.row.children.length===0">未分配权限</span>
          <el-row v-for="(item1 ,i) in scope.row.children" :key='i'>
            <el-col :span="4" >
              <el-tag @close="deleteRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key='i'>
                  <el-col :span="4">
                      <el-tag @close="deleteRight(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag @close="deleteRight(scope.row,item3.id)" v-for="(item3,i) in item2.children" :key='i' closable type="warning">
                        {{item3.authName}}
                    </el-tag>
                  </el-col>
              </el-row>
          </el-col>
      </el-row>
      </template>
      
      </el-table-column>
    <el-table-column
        type="index"
        label="#"
        width="100"
      ></el-table-column>
    <el-table-column
      prop="roleName"
      label="角色名称"
      width="200">
    </el-table-column>
    <el-table-column
      prop="roleDesc"
      label="角色描述"
      width="200">
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
             @click="showDeleteMsgBox(scope.row.id)"
            >
          </el-button>
          <el-button 
          size="mini" plain type="success"
          icon="el-icon-check" circle
          @click="showSetRoleBox(scope.row)"
          ></el-button>
       </template>
      </el-table-column>
      </el-table>
      <!-- 对话框 编辑角色权限-->
      <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <el-tree
        ref="tree"
        :data="rightlist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps">
        </el-tree>

  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
    <el-button type="primary" @click="setRoleRight()">确 定</el-button>
  </div>
</el-dialog>
     <!-- 添加角色的对话框 -->
     <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
  <el-form :model="form">
    <el-form-item label="角色名称" label-width="100px">
      <el-input v-model="form.roleName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" label-width="100px">
      <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="addRole()">确 定</el-button>
  </div>
</el-dialog>
<!-- 编辑对话框 -->
<el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
  <el-form :model="form">
    <el-form-item  label="角色名称" label-width="100px">
      <el-input disabled="false" v-model="form.roleName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" label-width="100px">
      <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click="editRole()">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            rolelist:[],
            dialogFormVisibleRight:false,
            dialogFormVisibleAdd:false,
            dialogFormVisibleEdit:false,
            rightlist:[],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            arrcheck:[],
            currroleid:-1,
            form:{
                roleName:'',
                roleDesc:''
            }
        }
    },
    created(){
        this.getRolelist();
    }
    ,
    methods:{
        async getRolelist(){
            // 请求头中Authorization设置
            const res=await this.$http.get(`roles`)
            // console.log(res)
            this.rolelist=res.data.data
        },
        async deleteRight(role,rightid){
            const res =await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
            role.children=res.data.data 
        },
        showDeleteMsgBox(roleid){
        this.$confirm('删除角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送删除请求
          const res=await this.$http.delete(`roles/${roleid}`)
          if(res.data.meta.status===200){
            this.getRolelist();
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
    async showSetRoleBox(role){
        this.currroleid=role.id
        this.dialogFormVisibleRight=true;
        const res=await this.$http.get(`rights/tree`)
        this.rightlist=res.data.data
        let arr=[]
        role.children.forEach(item1 => {
            // arr.push(item1.id)
            item1.children.forEach(item2 => {
                // arr.push(item2.id)
                item2.children.forEach(item3 => {
                    arr.push(item3.id)
                });
            });
        });
        this.arrcheck=arr
    },
    async setRoleRight(){
        // 获取全选的所有权限的id
        let arr1=this.$refs.tree.getCheckedKeys()
        console.log(arr1)
        // 获取半选的所有权限的id
        let arr2=this.$refs.tree.getHalfCheckedKeys()
        console.log(arr2)
        let arr =[...arr1,...arr2]
        console.log(arr)
        const res=await this.$http.post(`roles/${this.currroleid}/rights`,{
            rids: arr.join(',')
        })
        this.getRolelist();
        this.dialogFormVisibleRight=false;
    },
    showAddRoleDia(){
        this.form={}
        this.dialogFormVisibleAdd=true;
    },
    async addRole(){
        const res=await this.$http.post(`roles`,this.form)
        this.getRolelist();
        this.form={}
        this.dialogFormVisibleAdd=false;
    },
    showEditMsgBox(role){
        this.dialogFormVisibleEdit=true
        this.form=role
    },
    async editRole(){
        const res=await this.$http.put(`roles/${this.form.id}`,this.form)
        // console.log(role)
        if(res.data.meta.status==200){
            this.getRolelist();
            this.dialogFormVisibleEdit=false
        } 
    }
    }
}
</script>

<style scoped>
.addrolebtn{
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>