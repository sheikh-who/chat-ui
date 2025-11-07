import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// CSS imports
import './style.css'

// Create Pinia store
const pinia = createPinia()

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
}

// Mount app
app.mount('#app')

// Hide loading screen after app is mounted
setTimeout(() => {
  const loadingScreen = document.getElementById('loading-screen')
  if (loadingScreen) {
    loadingScreen.style.opacity = '0'
    setTimeout(() => {
      loadingScreen.style.display = 'none'
    }, 300)
  }
}, 1000)

console.log('Chat-UI initialized successfully! 🚀')