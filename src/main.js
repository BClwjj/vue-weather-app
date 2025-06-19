import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'   //./同级   ../上一级   @/根目录
import '@/assets/css/index.css'
import '@/assets/css/common.css'
import '@/assets/font/iconfont.css'

createApp(App).use(router).mount('#app')
