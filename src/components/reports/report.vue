<template>
    <el-card>
    <!-- 面包屑 -->
    <my-bread
      level1="数据统计"
      level2="数据报表"
      class="bread"
    ></my-bread>
    <div id="main" style="width: 700px;height:400px;"></div>
    </el-card>
</template>

<script>
var echarts=require('echarts')
export default {
    data(){
        return {

        }
    },
    mounted(){
        //useEcharts函数中操作dom元素所以不能放在created中 
        this.useEcharts()
    },
    methods:{
        async useEcharts(){
            var myChart = echarts.init(document.getElementById('main'));
            const res =await this.$http.get(`reports/type/1`);
            console.log(res)
            let option2=res.data.data
            let option1= {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          toolbox:{
              feature:{
                saveAsImage:{}
              }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
        //   xAxis: [
        //     {
        //       boundaryGap: false
        //     }
        //   ],
        //   yAxis: [
        //     {
        //       type: 'value'
        //     }
        //   ]
        }

        let option={...option1,...option2}
            myChart.setOption(option)
        }
    }
}
</script>

<style scoped>
.bread{
    margin-bottom: 20px;
}
</style>