<script setup>
import { onMounted, ref } from "vue"
// 引入 echarts 核心模块
import * as echarts from 'echarts'
import axios from 'axios'
import config from '@/utils/config'

const chart = ref()
const chart1 = ref()
let city = ref('北京')
let city2 = ref('北京')
let weather = ref({})
let location = ref({}) // 用于存储获取到的城市 id
let daily = ref({})  // 天气指数
let hourly = ref({})  // 每小时数据
let air = ref({})  // 空气质量

// 搜索功能
const search = async () => {
  city2.value = city.value
  // 获取地区的 LocationID
  let res1 = await axios.get('https://mu33jnddvf.re.qweatherapi.com//geo/v2/city/lookup', {
    params: {
      location: city.value,  // 输入的城市名
      key: config.apiKey
    }
  })
  location.value = res1.data.location[0].id
  console.log('地区 id:', location.value)
  // 实时天气
  let res = await axios.get('https://mu33jnddvf.re.qweatherapi.com/v7/weather/now', {
    params: {
      location: location.value,
      key: config.apiKey
    }
  })
  console.log('天气数据:', res.data)
  weather.value = res.data.now
  // 天气指数
  let res2 = await axios.get('https://mu33jnddvf.re.qweatherapi.com/v7/indices/1d', {
    params: {
      location: location.value,
      key: config.apiKey,
      type: '0'
    }
  })
  daily.value = res2.data.daily
  console.log('天气指数：', daily.value)
  // 每小时数据
  let res3 = await axios.get('https://mu33jnddvf.re.qweatherapi.com/v7/weather/24h', {
    params: {
      location: location.value,
      key: config.apiKey
    }
  })
  hourly.value = res3.data.hourly
  console.log('每小时数据', hourly.value.slice(0, 10))
  // 空气质量
  let res4 = await axios.get('https://mu33jnddvf.re.qweatherapi.com//v7/air/now', {
    params: {
      location: location.value,
      key: config.apiKey
    }
  })
  air.value = res4.data.now
  console.log('空气质量：', air.value)

  chartInit()
  chartInit1()
}
onMounted(() => {
  search()
})
// 每小时数据 折线图（修改后包含天气信息）
function chartInit() {
  let myChart = echarts.init(chart.value)

  const hourlyData = hourly.value.slice(0, 10)

  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#409EFF',
      borderWidth: 1,
      textStyle: { color: '#333' },
      formatter: function (params) {
        const time = params[0].name
        const temp = params[0].value
        const weatherText = params[0].data.weatherText
        return `${time}<br/>温度: ${temp}℃<br/>天气: ${weatherText}`
      }
    },
    xAxis: {
      type: 'category',
      data: hourlyData.map(item => item.fxTime.substring(11, 16)),
      axisLine: {
        lineStyle: { color: '#fff', width: 1 }
      },
      axisLabel: {
        color: '#fff',
        fontSize: 14,
        margin: 12
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.2)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#fff',
        fontSize: 14
      },
      splitNumber: 5
    },
    grid: {
      left: '10px',
      right: '10px',
      bottom: '20px',
      top: '30px',
      containLabel: true
    },
    series: [
      {
        name: '气温',
        data: hourlyData.map(item => ({
          value: item.temp,
          weatherText: item.text // 添加天气文本信息
        })),
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#409EFF'
        },
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              { offset: 0, color: 'rgba(64,158,255,0.5)' },
              { offset: 1, color: 'rgba(64,158,255,0.1)' }
            ]
          )
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 14,
          formatter: '{c}℃'
        },
        emphasis: {
          itemStyle: {
            color: '#FED624',
            borderColor: '#FED624',
            borderWidth: 2
          }
        }
      }
    ]
  }
  myChart.setOption(option)

  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
// 空气质量图表初始化函数
function chartInit1() {
  let myChart = echarts.init(chart1.value)
  let option = {
    series: [
      {
        type: 'gauge',
        max: 200,
        title: {
          color: '#FED624',
        },
        data: [
          {
            value: air.value.aqi,
            name: air.value.category
          }
        ],
        axisLine: {
          lineStyle: {
            color: [[0.25, '#8CD2AF'], [0.7, '#1EB04D'], [0.9, '#D73C31'], [2, '#6E2211']]
          }
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        detail: {
          fontSize: 40,
          color: '#FED624',
          offsetCenter: [0, '-30%'],
          formatter: '{value}',
        }
      }
    ]
  }

  myChart.setOption(option)
}

</script>

<template>
  <div class="container">
    <div class="search">
      <div class="search-item weatherWidth">
        <input type="text" placeholder="请输入城市名" v-model="city">
        <button class="iconfont icon-sousuo" @click="search"></button>
      </div>
    </div>
    <div class="weather weatherWidth">
      <div class="weather-left">
        <div class="labelWeather">{{ city2 }}天气</div>
        <div class="weather-summary">
          <img :src="`/src/assets/images/${weather.icon}.svg`" alt="">
          <p class="weather-temp">{{ weather.temp }}<span class="celsius">℃</span></p>
          <div class="weather-describe">
            <div class="weather-text">{{ weather.text }}</div>
            <div class="wether-feelslike">体感温度 {{ weather.feelsLike }}°</div>
          </div>
        </div>
        <div class="weather-item">
          <ul>
            <li>
              <div class="item-title">风向</div>
              <div class="item-details">{{ weather.windDir }}</div>
            </li>
            <li>
              <div class="item-title">风力等级</div>
              <div class="item-details">{{ weather.windScale }}级</div>
            </li>
            <li>
              <div class="item-title">相对温度</div>
              <div class="item-details">{{ weather.humidity }}%</div>
            </li>
            <li>
              <div class="item-title">大气压强</div>
              <div class="item-details">{{ weather.pressure }}hpa</div>
            </li>
            <li>
              <div class="item-title">能见度</div>
              <div class="item-details">{{ weather.vis }}公里</div>
            </li>
            <li>
              <div class="item-title">云量</div>
              <div class="item-details">{{ weather.cloud }}%</div>
            </li>
          </ul>
        </div>
        <p v-if="daily.length >= 2">{{ daily[2].text || '' }}{{ daily[4].text || '' }}</p>
      </div>
      <div class="weather-right">
        <div class=" labelWeather">空气质量</div>
        <div style="width:100%;height:220px;text-align:center">
          <div ref="chart1" style="width:100%;height:90%"></div>
          <div>空气质量指数等级{{ air.level }}级</div>
        </div>
      </div>
    </div>
    <div class="daily-item weatherWidth" v-if="daily.length >= 8">
      <div class="labelWeather">生活指数</div>
      <ul>
        <li>
          <div class="daily-icon">
            <i class="iconfont icon-sports"></i>
          </div>
          <div class="daily-box">
            <p class="daily-box-name">{{ daily[0].name }} {{ daily[0].category }}</p>
            <p class="daily-box-text">{{ daily[0].text }}</p>
          </div>
        </li>
        <li>
          <div class="daily-icon">
            <i class="iconfont icon-xiche-cuxiantiao"></i>
          </div>
          <div class="daily-box">
            <p class="daily-box-name">{{ daily[1].name }} {{ daily[1].category }}</p>
            <p class="daily-box-text">{{ daily[1].text }}</p>
          </div>
        </li>
        <li>
          <div class="daily-icon">
            <i class="iconfont icon-clothes-full"></i>
          </div>
          <div class="daily-box">
            <p class="daily-box-name">{{ daily[2].name }} {{ daily[2].category }}</p>
            <p class="daily-box-text">{{ daily[2].text }}</p>
          </div>
        </li>
        <li>
          <div class="daily-icon">
            <i class="iconfont icon-diaoyu"></i>
          </div>
          <div class="daily-box">
            <p class="daily-box-name">{{ daily[3].name }} {{ daily[3].category }}</p>
            <p class="daily-box-text">{{ daily[3].text }}</p>
          </div>
        </li>
        <li>
          <div class="daily-icon">
            <i class="iconfont icon-fengjingjingdianlvyouxiaozhenfangziminsumianxing"></i>
          </div>
          <div class="daily-box">
            <p class="daily-box-name">{{ daily[5].name }} {{ daily[5].category }}</p>
            <p class="daily-box-text">{{ daily[5].text }}</p>
          </div>
        </li>
        <li>
          <div class="daily-icon">
            <i class="iconfont icon-guominyuanjinghua"></i>
          </div>
          <div class="daily-box">
            <p class="daily-box-name">{{ daily[6].name }} {{ daily[6].category }}</p>
            <p class="daily-box-text">{{ daily[6].text }}</p>
          </div>
        </li>
        <li>
          <div class="daily-icon">
            <i class="iconfont icon-ganmao"></i>
          </div>
          <div class="daily-box">
            <p class="daily-box-name">{{ daily[8].name }} {{ daily[8].category }}</p>
            <p class="daily-box-text">{{ daily[8].text }}</p>
          </div>
        </li>
        <li>
          <div class="daily-icon">
            <i class="iconfont icon-fangshai"></i>
          </div>
          <div class="daily-box">
            <p class="daily-box-name">{{ daily[15].name }} {{ daily[15].category }}</p>
            <p class="daily-box-text">{{ daily[15].text }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="weatherWidth">
      <div class="labelWeather">每小时预报</div>
      <div ref="chart" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>