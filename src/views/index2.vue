<script setup>
import { onMounted,ref } from "vue";
//引入echarts核心模块
import * as echarts from 'echarts';

const chart=ref();
function chartInit() {
  // 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(chart.value);
// 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
}
onMounted(()=>{
  chartInit()
})

</script>

<template>
  <div ref="chart" style="width: 600px; height: 400px;"></div>
</template>

<style scoped>

</style>
