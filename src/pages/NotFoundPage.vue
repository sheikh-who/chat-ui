<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-illustration">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            <path d="M19 18V20H5V18H19ZM19 6V16H5V6H19Z" fill="currentColor"/>
          </svg>
        </div>
        
        <h1 class="error-title">404</h1>
        <h2 class="error-subtitle">Page Not Found</h2>
        
        <p class="error-description">
          Oops! The page you're looking for seems to have vanished into the digital void. 
          This could be because the page has been moved, deleted, or the URL might be incorrect.
        </p>
        
        <div class="error-actions">
          <router-link to="/" class="btn btn-primary">
            <Icon name="home" />
            Go to Home
          </router-link>
          <button @click="goBack" class="btn btn-secondary">
            <Icon name="arrow-left" />
            Go Back
          </button>
        </div>
        
        <div class="helpful-links">
          <h3>You might be looking for:</h3>
          <div class="links-grid">
            <router-link to="/" class="helpful-link">
              <Icon name="message-circle" />
              <div>
                <strong>Chat</strong>
                <span>Start a conversation with AI</span>
              </div>
            </router-link>
            
            <router-link to="/settings" class="helpful-link">
              <Icon name="settings" />
              <div>
                <strong>Settings</strong>
                <span>Configure your preferences</span>
              </div>
            </router-link>
            
            <router-link to="/help" class="helpful-link">
              <Icon name="help-circle" />
              <div>
                <strong>Help</strong>
                <span>Get support and documentation</span>
              </div>
            </router-link>
          </div>
        </div>
        
        <div class="error-details">
          <details>
            <summary>Technical Details</summary>
            <div class="details-content">
              <p><strong>Error Code:</strong> 404 Not Found</p>
              <p><strong>Requested URL:</strong> <code>{{ currentPath }}</code></p>
              <p><strong>Timestamp:</strong> {{ currentTime }}</p>
              <p><strong>User Agent:</strong> {{ userAgent }}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '@/components/Icon.vue'

const router = useRouter()
const route = useRoute()

const currentPath = ref('')
const currentTime = ref('')
const userAgent = ref('')

// Get current time
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString()
}

// Go back to previous page
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

// Set page metadata
onMounted(() => {
  // Set document title
  document.title = 'Page Not Found - Chat-UI'
  
  // Set current path
  currentPath.value = window.location.pathname + window.location.search
  
  // Get user agent
  userAgent.value = navigator.userAgent
  
  // Update time
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.not-found-content {
  text-align: center;
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
}

.error-illustration {
  margin-bottom: 2rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: var(--primary-color);
  opacity: 0.3;
}

.error-title {
  font-size: 6rem;
  font-weight: 800;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-subtitle {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0.5rem 0 1.5rem 0;
}

.error-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 500px;
  margin: 0 auto 2.5rem auto;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  justify-content: center;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-hover);
  transform: translateY(-1px);
}

.helpful-links {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.helpful-links h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.helpful-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.helpful-link:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.helpful-link svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.helpful-link div {
  text-align: left;
}

.helpful-link strong {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.helpful-link span {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.error-details {
  margin-top: 2rem;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  list-style: none;
  user-select: none;
  transition: all 0.2s;
}

.error-details summary:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.error-details summary::-webkit-details-marker {
  display: none;
}

.error-details summary::after {
  content: '▼';
  float: right;
  transition: transform 0.2s;
}

.error-details[open] summary::after {
  transform: rotate(180deg);
}

.details-content {
  padding: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 6px 6px;
  margin-top: -1px;
}

.details-content p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.details-content strong {
  color: var(--text-primary);
  font-weight: 600;
}

.details-content code {
  background: var(--bg-tertiary);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary-color);
}

/* Animations */
.not-found-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-title {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .not-found-content {
    padding: 2rem 1.5rem;
  }
  
  .error-title {
    font-size: 4rem;
  }
  
  .error-subtitle {
    font-size: 1.5rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 200px;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .helpful-link {
    flex-direction: column;
    text-align: center;
  }
  
  .helpful-link div {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .not-found-page {
    padding: 1rem 0.5rem;
  }
  
  .not-found-content {
    padding: 1.5rem 1rem;
  }
  
  .error-title {
    font-size: 3rem;
  }
  
  .error-subtitle {
    font-size: 1.25rem;
  }
}
</style>