<template>
  <el-card>
    <my-bread
      level1="商品管理"
      level2="分类参数"
      class="bread"
    ></my-bread>
    <el-alert
      class="alert"
      title="只允许为第三级分类设置参数"
      type="error"
      center
      show-icon
    ></el-alert>
    <el-form
      label-position="left"
      label-width="80px"
      style="overflow:auto; height:400px"
    >
      <el-form-item label="商品分类">
        <el-cascader
          clearable
          v-model="selectedOptions"
          :options="options"
          :props="defaultProp"
          :show-all-levels="false"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>

      <el-tabs
        tab-position="top"
        v-model="active"
        @tab-click="tabChange()"
      >
        <el-tab-pane
          label="用户管理"
          name="1"
        >
          <el-button type="danger" @click="showAddParamsDia()">设置动态参数</el-button>
          <el-table
            :data="arrDyparams"
            style="width: 100%"
          >
            <el-table-column
              type="expand"
              width="60"
            >
            <template slot-scope="scope">
                <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,tag)"
              >
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
              >+ New Tag</el-button>
            </template>
              
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
              width="200"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="showEditMsgBox(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="showDeleteMsgBox(scope.row.attr_id)"
                >
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="配置管理"
          name="2"
        >
        <el-button type="danger" @click="showAddParamsDia()">设置静态参数</el-button>
        <el-table
            :data="arrStaticparams"
            style="width: 100%"
          >
          <el-table-column
              type="index"
              label="#"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="attr_vals"
              label="属性值"
              width="200"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="showEditMsgBox(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="showDeleteMsgBox(scope.row.attr_id)"
                >
                </el-button>
              </template>
            </el-table-column>
        </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 对话框 -->
    <el-dialog title="添加分类参数" :visible.sync="dialogFormVisibleAdd">
  <el-form :model="form">
    <el-form-item label="参数名称" label-width="100px">
      <el-input v-model="form.attr_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="参数值" label-width="100px">
      <el-input v-model="form.attr_vals" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="addParams()">确 定</el-button>
  </div>
</el-dialog>
<!-- 编辑对话框 -->
<el-dialog title="编辑参数" :visible.sync="dialogFormVisibleEdit">
  <el-form :model="form">
    <el-form-item  label="参数名称" label-width="100px">
      <el-input disabled="false" v-model="form.attr_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="参数值" label-width="100px">
      <el-input v-model="form.attr_vals" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click="editParams()">确 定</el-button>
  </div>
</el-dialog>

  </el-card>
</template>

<script>
export default {
    data(){
        return{
            selectedOptions:[],
            options:[],
            defaultProp:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                expandTrigger:'hover'
            },
            arrDyparams:[],
            arrStaticparams:[],
            active:'',
            // el-tag显示
            // dynamicTags: ['标签一', '标签二', '标签三'],
            inputVisible: false,
            inputValue: '',
            form:{
                attr_name:'',
                attr_sel:'',
                attr_vals:''
            },
            dialogFormVisibleAdd:false,
            dialogFormVisibleEdit:false
        }
    },
    created(){
        this.getGoodCate()
    },
    methods:{
        async getGoodCate(){
            const res=await this.$http.get(`categories?type=3`)
            this.options=res.data.data
        },
        // 选择三级标签时触发
        async handleChange(){
            if(this.selectedOptions.length===3){
                // 获取动态参数
                const res=await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                this.arrDyparams=res.data.data
                // console.log(this.arrDyparams)
                this.arrDyparams.forEach(item => {
                    item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.trim().split(',')
                }); 
                const res1=await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                // console.log(res)
                this.arrStaticparams=res1.data.data
                console.log(this.arrStaticparams)
            }
        },
        tabChange(){

        },
        // 点击tag中的x号
        async handleClose(attr,tag) {
            attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);
            // 提交修改参数1.7.5
            const res=await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,{
                attr_name: attr.attr_name,
                attr_sel: attr.attr_sel,
                attr_vals:attr.attr_vals.join(',')
            })
            // console.log(res)
        },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      async handleInputConfirm(attr) {
        let inputValue = this.inputValue;
        if (inputValue) {
          attr.attr_vals.push(inputValue);
          const res=await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,{
                attr_name: attr.attr_name,
                attr_sel: attr.attr_sel,
                attr_vals:attr.attr_vals.join(',')
            })
            // console.log(res)
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      showAddParamsDia(){
        this.form={}
          this.dialogFormVisibleAdd=true;
      },
      async addParams(){
          if(this.active==='1'){
              this.form.attr_sel='many'
          }
          if(this.active==='2'){
              this.form.attr_sel='only'
          }
          const res=await this.$http.post(`categories/${this.selectedOptions[2]}/attributes`,this.form)
        // console.log(res)
        if(res.data.meta.status===201){
            // this.handleChange()
            if(this.active==='1'){
              this.arrDyparams.push(res.data.data)
              // console.log(this.arrDyparams)
            }
            if(this.active==='2'){
              this.arrStaticparams.push(res.data.data)
            }
                
                
        }
        this.dialogFormVisibleAdd=false;
      },
      showDeleteMsgBox(attrid){
      this.$confirm('删除参数?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送删除请求
          const res=await this.$http.delete(`categories/${this.selectedOptions[2]}/attributes/${attrid}`)
          // console.log(res)
          if(res.data.meta.status===200){
            // this.getUserList()
            if(this.active==='1'){
              // this.arrDyparams
              let index=this.arrDyparams.findIndex((item)=>{
               return item.attr_id===attrid
              })
              this.arrDyparams.splice(index,1)
              // console.log(this.arrDyparams)
            }
            if(this.active==='2'){
              let index=this.arrStaticparams.findIndex((item)=>{
               return item.attr_id===attrid
              })
              this.arrStaticparams.splice(index,1)
            }
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
      showEditMsgBox(attr){
        if(this.active==='1'){
          attr.attr_vals=attr.attr_vals.join(',')
        }
      this.form=attr;
      // console.log(this.form)
      this.dialogFormVisibleEdit=true;
    },
    async editParams(){
       if(this.active==='1'){
              this.form.attr_sel='many'
          }
          if(this.active==='2'){
              this.form.attr_sel='only'
          }
      const res =await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${this.form.attr_id}`,this.form)
      console.log(res)
      if(res.data.meta.status==200){
        if(this.active==='1'){
              // this.arrDyparams
              let index=this.arrDyparams.findIndex((item)=>{
               return item.attr_id===this.form.attr_id
              })
              res.data.data.attr_vals=res.data.data.attr_vals.length===0?[]:res.data.data.attr_vals.trim().split(',')
              this.arrDyparams.splice(index,1,res.data.data)
              console.log(this.arrDyparams)
            }
            if(this.active==='2'){
              let index=this.arrStaticparams.findIndex((item)=>{
               return item.attr_id===this.form.attr_id
              })
              this.arrStaticparams.splice(index,1,res.data.data)
            }
      }
      this.dialogFormVisibleEdit=false
    },
    }
}
</script>

<style scoped>
.alert {
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>