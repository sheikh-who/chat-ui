<template>
  <div id="app" :data-theme="currentTheme">
    <!-- Main Application -->
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <!-- Logo and Title -->
            <div class="header-left">
              <div class="logo">
                <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h1>Chat-UI</h1>
              </div>
              <span class="version-badge">v1.0.0</span>
            </div>
            
            <!-- Header Actions -->
            <div class="header-right">
              <!-- Theme Toggle -->
              <button 
                @click="toggleTheme" 
                class="btn btn-ghost theme-toggle"
                :title="`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`"
              >
                <svg v-if="currentTheme === 'light'" class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-4C7.01 4 4 7.01 4 12h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-4.99-3.01-8-8-8z"/>
                </svg>
                <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12 6c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4s4 1.79 4 4h2c0-3.31-2.69-6-6-6z"/>
                </svg>
              </button>
              
              <!-- Settings -->
              <button 
                @click="showSettings = !showSettings"
                class="btn btn-ghost settings-toggle"
                title="Settings"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.97s-.03-.65-.07-.97l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.97s.03.65.07.97l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
              </button>
              
              <!-- GitHub Link -->
              <a 
                href="https://github.com/sheikh-who/chat-ui" 
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost github-link"
                title="View on GitHub"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="app-main">
        <router-view />
      </main>
      
      <!-- Settings Panel -->
      <SettingsPanel 
        v-if="showSettings"
        @close="showSettings = false"
        @save="handleSettingsSave"
      />
    </div>
    
    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import SettingsPanel from '@/components/SettingsPanel.vue'
import ToastContainer from '@/components/ToastContainer.vue'

export default {
  name: 'App',
  components: {
    SettingsPanel,
    ToastContainer
  },
  setup() {
    const settingsStore = useSettingsStore()
    const showSettings = ref(false)
    
    const currentTheme = computed(() => settingsStore.theme)
    
    const toggleTheme = () => {
      settingsStore.toggleTheme()
    }
    
    const handleSettingsSave = (settings) => {
      settingsStore.updateSettings(settings)
      showSettings.value = false
    }
    
    onMounted(() => {
      // Initialize theme from localStorage
      settingsStore.loadSettings()
      
      // Check for system theme preference
      if (!settingsStore.theme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        settingsStore.setTheme(prefersDark ? 'dark' : 'light')
      }
    })
    
    return {
      currentTheme,
      showSettings,
      toggleTheme,
      handleSettingsSave
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
}

.app-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: var(--accent);
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.version-badge {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle,
.settings-toggle,
.github-link {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.theme-toggle:hover,
.settings-toggle:hover,
.github-link:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.app-main {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-left {
    justify-content: center;
  }
  
  .header-right {
    justify-content: center;
  }
  
  .logo h1 {
    font-size: 1.25rem;
  }
}
</style>