import './assets/main.css'
import { createRouter, createWebHistory } from 'vue-router' // Use this
import employeeList from './components/employeeList/employeeList.vue'
import Notifications from '@kyvg/vue3-notification';


import { createApp } from 'vue'
import App from './App.vue'

const routes = [
  { path: '/', component: employeeList },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
const app = createApp(App)
app.use(router)
app.use(Notifications)
app.mount('#app')
