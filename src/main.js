import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 引入默认主题
import App from './App.vue'
import router from './router';  // 确保引入 router/index.js 文件

const app = createApp(App)
app.use(ElementPlus)
app.use(router)  // 确保应用路由
app.mount('#app')

