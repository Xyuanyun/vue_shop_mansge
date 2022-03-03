<template>
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name:'my-bread',
    data(){
        return{
            // level1:'',
            // level2:''
        }
    },
    // props值是字符串数组
    // 用法与data相同
    props:['level1','level2']
}
</script>

<style scoped>

</style>