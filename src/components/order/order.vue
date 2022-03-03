<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread
      level1="订单管理"
      level2="订单列表"
      class="bread"
    ></my-bread>
    <!-- <el-tabs v-model="active" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="1">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="2">配置管理</el-tab-pane>
  </el-tabs> -->
    <!-- 表格 -->
    <el-table
      :data="list"
      style="width: 100%"
      height="400px"
    >
      <el-table-column
        type="index"
        label="#"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="150"
      ></el-table-column>
      <el-table-column
        label="是否付款"
        width="150"
      >
      <template slot-scope="scope">
          <el-tag v-show="scope.row.order_pay==='0'">已付款</el-tag>
          <el-tag type="danger" v-show="scope.row.order_pay==='1'">未付款</el-tag>
      </template>
      </el-table-column>
      <el-table-column
        prop="consignee_addr"
        label="发货地址"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="150"
      ></el-table-column>
      <el-table-column
        label="下单时间"
        width="150"
      >
      <template slot-scope="scope">{{scope.row.create_time | fmtdata}}</template>
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
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog
      title="修改订单地址"
      :visible.sync="dialogFormVisibleEdit"
    >
      <el-form :model="form">
        <el-form-item
          label="省市区"
          label-width="100px"
        >
          <el-cascader
                    clearable
                    v-model="selectedOptions"
                    :options="options"
                    :props="defaultProp"
                    @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          label-width="100px"
        >
          <el-input
            v-model="form.consignee_addr"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否发货"
          label-width="100px"
        >
          <el-input
            v-model="form.is_send"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editOrder()"
        >确 定</el-button>
      </div>
    </el-dialog>
  
  </el-card>
</template>

<script>
import options from '@/assets/city_data2017_element.js'
export default {
    data(){
        return{
            dialogFormVisibleEdit:false,
            // query:'',
      list: [],
      // 分页数据
    //   total:-1,
      pagenum:1,
      pagesize:10,
      selectedOptions:[],
            options:[],
            defaultProp:{
                label:'label',
                value:'value',
                children:'children',
                expandTrigger:'hover'
            },
            form:{
                consignee_addr:'',
                is_send:''
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        async getList(){
            const res =await this.$http.get(
        `orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        console.log(res)
        this.list=res.data.data.goods
        // this.total=res.data.data.total
        console.log(this.list)
        },
        showEditMsgBox(order){
          this.form=order
      this.options=options
      this.dialogFormVisibleEdit=true;
    },
    async editOrder(){
      const res =await this.$http.put(`orders/${this.form.order_id}`,this.form)
      console.log(res)
      this.dialogFormVisibleEdit=false;
    }
    }
}
</script>

<style scoped>
</style>