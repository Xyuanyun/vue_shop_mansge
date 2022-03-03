<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表" class="bread"></my-bread>
    <el-alert class="alert" title="添加商品信息" type="success" center show-icon></el-alert>
    <el-steps :space="200" class="step" :active="1*active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form label-position="top" label-width="80px" :model="form" style="overflow:auto; height:400px">
        <el-tabs tab-position="left"  v-model="active" @tab-click="tabChange()">
        <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称">
                <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
                <el-input v-model="form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
                <el-input v-model="form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
                <el-input v-model="form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
                <el-cascader
                    clearable
                    v-model="selectedOptions"
                    :options="options"
                    :props="defaultProp"
                    @change="handleChange"></el-cascader>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2" >
            <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDyparams" :key="i">
                <el-checkbox-group v-model="item1.attr_vals">
                    <el-checkbox  border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaticparams" :key="i">
                <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
            <el-form-item>
             <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers="headers"
                :on-preview="handlePreview"
                
                :on-success="handleSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
             </el-upload>   
            </el-form-item>
            
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
            <el-form-item>
                <el-button type="primary" @click="addGoods">添加商品</el-button>
                <quill-editor v-model="form.goods_introduce"></quill-editor>
            </el-form-item>
        </el-tab-pane>
        </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
    components: {quillEditor},
    data(){
        return{
            active:'',
            form:{
                goods_name:'',
                goods_cat:'',
                goods_price:'',
                goods_number:'',
                goods_weight:'',
                goods_introduce:'',
                pics:[],
                attrs:[]
            },
            selectedOptions:[],
            options:[],
            defaultProp:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                expandTrigger:'hover'
            },
            // 动态参数数据
            arrDyparams:[],
            // 静态参数数据
            arrStaticparams:[],
            headers:{
                Authorization:localStorage.getItem('token')
            }

        }
    },
    created(){
        this.getGoodCate()
    },
    methods:{
        // 获取三级分类
        async getGoodCate(){
            const res=await this.$http.get(`categories?type=3`)
            this.options=res.data.data
        },
        handleChange(){

        },
        async tabChange(){
            if(this.active==='2'){
                // console.log(this.selectedOptions)
                if(this.selectedOptions.length!==3){
                    this.$message.warning('请先选择三级分类')
                    return
                }
                else{
                    const res=await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                    this.arrDyparams=res.data.data
                    // console.log(this.arrDyparams)
                    this.arrDyparams.forEach(item => {
                        item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.trim().split(',')
                    }); 
                }
            }
            if(this.active==='3'){
                if(this.selectedOptions.length!==3){
                    this.$message.warning('请先选择三级分类')
                    return
                }
                else{
                    const res=await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                    // console.log(res)
                    this.arrStaticparams=res.data.data
                }
            }
        },
        handleRemove(file) {
            console.log('移除')
            // 获取数组的索引file.response.data.tmp_path
            // findIndex((item)=>{})把符合条件的索引值返回
            let index=this.form.pics.findIndex((item)=>{
               return item.pic===file.response.data.tmp_path
            })
            this.form.pics.splice(index,1)
            console.log(this.form.pics)
        },
        handleSuccess(file){
            console.log('成功')
            this.form.pics.push({
                pre:file.data.tmp_path
            })
            // console.log(file);
        },
        async addGoods(){
            this.form.goods_cat=this.selectedOptions.join(',')
            this.form.attrs=[...this.arrDyparams,...this.arrStaticparams]
            const res=await this.$http.post(`goods`,this.form)
            console.log(res);
            this.$router.replace('/goods');
        }
    }
}
</script>

<style scoped>
.alert{
    margin-bottom: 10px;
    margin-top: 10px;
}
.step{
    margin-bottom: 10px;
    margin-top: 20px;
}
.ql-editor{
    height: 300px;
}
</style>