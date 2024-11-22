import './assets/main.css'
import { createRouter , createWebHistory } from 'vue-router';
import {routes} from "./routes/index";
import Notifications from '@kyvg/vue3-notification';
import { createApp } from 'vue'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes
})
const app = createApp(App)
app.use(router)
app.use(Notifications)
app.mount('#app')
