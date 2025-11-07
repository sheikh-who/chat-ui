<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', toast.type]"
        >
          <div class="toast-content">
            <svg v-if="toast.type === 'success'" class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
            </svg>
            <svg v-else-if="toast.type === 'warning'" class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            
            <div class="toast-message">
              <strong v-if="toast.title">{{ toast.title }}</strong>
              <p>{{ toast.message }}</p>
            </div>
          </div>
          
          <button @click="removeToast(toast.id)" class="toast-close">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

let toastId = 0

export default {
  name: 'ToastContainer',
  setup() {
    const toasts = ref([])
    
    const addToast = (toast) => {
      const id = ++toastId
      const newToast = {
        id,
        type: toast.type || 'info',
        title: toast.title,
        message: toast.message,
        duration: toast.duration || 5000
      }
      
      toasts.value.push(newToast)
      
      // Auto remove after duration
      if (newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, newToast.duration)
      }
    }
    
    const removeToast = (id) => {
      const index = toasts.value.findIndex(toast => toast.id === id)
      if (index !== -1) {
        toasts.value.splice(index, 1)
      }
    }
    
    const clearAll = () => {
      toasts.value = []
    }
    
    // Global toast methods
    const showSuccess = (message, title = null, duration = 3000) => {
      addToast({ type: 'success', message, title, duration })
    }
    
    const showError = (message, title = null, duration = 5000) => {
      addToast({ type: 'error', message, title, duration })
    }
    
    const showWarning = (message, title = null, duration = 4000) => {
      addToast({ type: 'warning', message, title, duration })
    }
    
    const showInfo = (message, title = null, duration = 3000) => {
      addToast({ type: 'info', message, title, duration })
    }
    
    onMounted(() => {
      // Make toast methods globally available
      window.$toast = {
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo,
        add: addToast,
        remove: removeToast,
        clear: clearAll
      }
    })
    
    onUnmounted(() => {
      // Clean up global reference
      if (window.$toast) {
        delete window.$toast
      }
    })
    
    return {
      toasts,
      removeToast
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  padding: 1rem;
  margin-bottom: 0.75rem;
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  position: relative;
}

.toast.success {
  border-left: 4px solid var(--success);
}

.toast.error {
  border-left: 4px solid var(--error);
}

.toast.warning {
  border-left: 4px solid var(--warning);
}

.toast.info {
  border-left: 4px solid var(--accent);
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
}

.toast .icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.success .icon {
  color: var(--success);
}

.error .icon {
  color: var(--error);
}

.warning .icon {
  color: var(--warning);
}

.info .icon {
  color: var(--accent);
}

.toast-message {
  flex: 1;
}

.toast-message strong {
  display: block;
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.toast-message p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.toast-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.toast-close .icon {
  width: 1rem;
  height: 1rem;
}

/* Transition animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    top: 0.5rem;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>