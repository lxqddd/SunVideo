import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'normalize.css'
import 'virtual:uno.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'

import './styles/index.scss'

const app = createApp(App)
app.mount('#app')
app.use(ElementPlus, {
  locale: zhCn,
})