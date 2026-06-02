import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/reset.scss'
import './styles/global.scss'
import './styles/layout.scss'
import './styles/list.scss'
import './styles/detail.scss'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
