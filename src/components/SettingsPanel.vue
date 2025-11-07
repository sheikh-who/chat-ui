<template>
  <div class="settings-panel" @click.self="handleClose">
    <div class="settings-modal">
      <div class="settings-header">
        <h2>Settings</h2>
        <button @click="handleClose" class="close-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      
      <div class="settings-content">
        <div class="settings-sidebar">
          <nav class="settings-nav">
            <button
              v-for="section in settingsSections"
              :key="section.id"
              @click="activeSection = section.id"
              :class="['nav-item', { active: activeSection === section.id }]"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                {{ section.icon }}
              </svg>
              <span>{{ section.label }}</span>
            </button>
          </nav>
        </div>
        
        <div class="settings-main">
          <div v-if="activeSection === 'api'" class="settings-section">
            <h3>API Configuration</h3>
            <div class="form-group">
              <label for="apiKey">API Key</label>
              <div class="input-group">
                <input
                  id="apiKey"
                  v-model="settings.apiKey"
                  type="password"
                  placeholder="Enter your MiniMax API key"
                  class="form-input"
                >
                <button @click="togglePasswordVisibility" class="btn btn-ghost">
                  <svg v-if="showPassword" class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  </svg>
                  <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="baseURL">Base URL</label>
              <input
                id="baseURL"
                v-model="settings.baseURL"
                type="url"
                placeholder="https://api.minimax.chat/v1"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="defaultModel">Default Model</label>
              <select v-model="settings.defaultModel" id="defaultModel" class="form-select">
                <option value="minimax-m2">MiniMax M2</option>
                <option value="minimax-m2-stable">MiniMax M2 Stable</option>
              </select>
            </div>
            
            <div class="form-group">
              <button @click="testConnection" class="btn btn-secondary" :disabled="testing">
                <svg v-if="testing" class="icon spinning" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2V6L16 2H12Z" />
                </svg>
                <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Test Connection
              </button>
            </div>
            
            <div v-if="connectionTest" :class="['test-result', connectionTest.type]">
              {{ connectionTest.message }}
            </div>
          </div>
          
          <div v-if="activeSection === 'model'" class="settings-section">
            <h3>Model Parameters</h3>
            
            <div class="form-group">
              <label for="maxTokens">Max Tokens</label>
              <div class="range-group">
                <input
                  id="maxTokens"
                  v-model.number="settings.maxTokens"
                  type="range"
                  min="1"
                  max="4096"
                  class="form-range"
                >
                <span class="range-value">{{ settings.maxTokens }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="temperature">Temperature</label>
              <div class="range-group">
                <input
                  id="temperature"
                  v-model.number="settings.temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  class="form-range"
                >
                <span class="range-value">{{ settings.temperature.toFixed(1) }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="topP">Top P</label>
              <div class="range-group">
                <input
                  id="topP"
                  v-model.number="settings.topP"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  class="form-range"
                >
                <span class="range-value">{{ settings.topP.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="topK">Top K</label>
              <div class="range-group">
                <input
                  id="topK"
                  v-model.number="settings.topK"
                  type="range"
                  min="1"
                  max="100"
                  class="form-range"
                >
                <span class="range-value">{{ settings.topK }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="activeSection === 'ui'" class="settings-section">
            <h3>User Interface</h3>
            
            <div class="form-group">
              <label>Theme</label>
              <div class="toggle-group">
                <button
                  @click="setTheme('light')"
                  :class="['toggle-btn', { active: settings.theme === 'light' }]"
                >
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-4C7.01 4 4 7.01 4 12h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-4.99-3.01-8-8-8z"/>
                  </svg>
                  Light
                </button>
                <button
                  @click="setTheme('dark')"
                  :class="['toggle-btn', { active: settings.theme === 'dark' }]"
                >
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  </svg>
                  Dark
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="settings.showTimestamps"
                  type="checkbox"
                  class="form-checkbox"
                >
                <span class="checkmark"></span>
                Show timestamps
              </label>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="settings.showMessageActions"
                  type="checkbox"
                  class="form-checkbox"
                >
                <span class="checkmark"></span>
                Show message actions
              </label>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="settings.autoScroll"
                  type="checkbox"
                  class="form-checkbox"
                >
                <span class="checkmark"></span>
                Auto scroll to new messages
              </label>
            </div>
          </div>
          
          <div v-if="activeSection === 'data'" class="settings-section">
            <h3>Data Management</h3>
            
            <div class="data-info">
              <p>Storage Usage</p>
              <div class="storage-bar">
                <div 
                  class="storage-fill" 
                  :style="{ width: storageUsage.percentage + '%' }"
                ></div>
              </div>
              <p class="storage-text">
                {{ formatFileSize(storageUsage.used) }} / {{ formatFileSize(storageUsage.max) }}
                ({{ storageUsage.percentage.toFixed(1) }}%)
              </p>
            </div>
            
            <div class="form-group">
              <button @click="exportSettings" class="btn btn-secondary">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Export Settings
              </button>
            </div>
            
            <div class="form-group">
              <label class="btn btn-secondary">
                <input
                  type="file"
                  accept=".json"
                  @change="importSettings"
                  class="hidden"
                >
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Import Settings
              </label>
            </div>
            
            <div class="form-group">
              <button @click="clearAllData" class="btn btn-danger">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-footer">
        <button @click="handleClose" class="btn btn-primary">
          Save & Close
        </button>
        <button @click="resetSettings" class="btn btn-secondary">
          Reset to Defaults
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatFileSize } from '@/utils/numberUtils'
import { minimaxService } from '@/services/minimaxService'

export default {
  name: 'SettingsPanel',
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const settingsStore = useSettingsStore()
    
    const activeSection = ref('api')
    const showPassword = ref(false)
    const testing = ref(false)
    const connectionTest = ref(null)
    
    const settings = reactive({
      apiKey: '',
      baseURL: '',
      defaultModel: '',
      maxTokens: 0,
      temperature: 0,
      topP: 0,
      topK: 0,
      theme: '',
      showTimestamps: false,
      showMessageActions: false,
      autoScroll: false
    })
    
    const storageUsage = ref({
      used: 0,
      max: 10 * 1024 * 1024, // 10MB
      percentage: 0
    })
    
    const settingsSections = [
      {
        id: 'api',
        label: 'API Configuration',
        icon: '<path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.4 7 14.8 7.6 15.8 8.6C16.8 9.6 17.4 11 17.4 12.4H6.6C6.6 11 7.2 9.6 8.2 8.6C9.2 7.6 10.6 7 12 7Z"/>'
      },
      {
        id: 'model',
        label: 'Model Parameters',
        icon: '<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>'
      },
      {
        id: 'ui',
        label: 'User Interface',
        icon: '<path d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L10.91 8.26L12 2Z"/>'
      },
      {
        id: 'data',
        label: 'Data Management',
        icon: '<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>'
      }
    ]
    
    const handleClose = () => {
      saveSettings()
      emit('close')
    }
    
    const saveSettings = () => {
      settingsStore.updateSettings(settings)
      emit('save', settings)
    }
    
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }
    
    const setTheme = (theme) => {
      settingsStore.setTheme(theme)
      settings.theme = theme
    }
    
    const testConnection = async () => {
      if (!settings.apiKey || !settings.baseURL) {
        connectionTest.value = {
          type: 'error',
          message: 'Please enter API key and base URL'
        }
        return
      }
      
      testing.value = true
      connectionTest.value = null
      
      try {
        const result = await minimaxService.testConnection({
          apiKey: settings.apiKey,
          baseURL: settings.baseURL
        })
        
        connectionTest.value = {
          type: result.success ? 'success' : 'error',
          message: result.message
        }
      } catch (error) {
        connectionTest.value = {
          type: 'error',
          message: error.message
        }
      } finally {
        testing.value = false
      }
    }
    
    const exportSettings = () => {
      const exportData = settingsStore.exportSettings()
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `chat-ui-settings-${new Date().toISOString().split('T')[0]}.json`
      link.click()
    }
    
    const importSettings = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result)
          const result = settingsStore.importSettings(importData)
          
          connectionTest.value = {
            type: result.success ? 'success' : 'error',
            message: result.message
          }
          
          if (result.success) {
            loadSettings()
          }
        } catch (error) {
          connectionTest.value = {
            type: 'error',
            message: 'Invalid settings file'
          }
        }
      }
      reader.readAsText(file)
      
      // Reset input
      event.target.value = ''
    }
    
    const clearAllData = () => {
      if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        const result = settingsStore.clearAllData()
        connectionTest.value = {
          type: result.success ? 'success' : 'error',
          message: result.message
        }
        if (result.success) {
          loadSettings()
        }
      }
    }
    
    const resetSettings = () => {
      if (confirm('Are you sure you want to reset all settings to defaults?')) {
        settingsStore.resetSettings()
        loadSettings()
        connectionTest.value = {
          type: 'success',
          message: 'Settings reset to defaults'
        }
      }
    }
    
    const loadSettings = () => {
      const currentSettings = settingsStore.settings
      Object.assign(settings, currentSettings)
      storageUsage.value = settingsStore.getStorageUsage()
    }
    
    onMounted(() => {
      loadSettings()
    })
    
    return {
      activeSection,
      showPassword,
      testing,
      connectionTest,
      settings,
      storageUsage,
      settingsSections,
      handleClose,
      saveSettings,
      togglePasswordVisibility,
      setTheme,
      testConnection,
      exportSettings,
      importSettings,
      clearAllData,
      resetSettings,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.settings-modal {
  background: var(--bg-primary);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.settings-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.settings-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.settings-sidebar {
  width: 200px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 1rem 0;
}

.settings-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-soft);
  color: var(--accent);
  border-right: 3px solid var(--accent);
}

.nav-item .icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.settings-main {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.settings-section h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.range-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-range {
  flex: 1;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  outline: none;
  appearance: none;
}

.form-range::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
}

.form-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--accent);
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

.range-value {
  min-width: 3rem;
  text-align: right;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.toggle-group {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: var(--bg-primary);
  border-color: var(--border-hover);
}

.toggle-btn.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  margin-bottom: 0 !important;
}

.form-checkbox {
  display: none;
}

.checkmark {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 0.25rem;
  background: var(--bg-primary);
  transition: all 0.2s ease;
  position: relative;
}

.checkbox-label input:checked + .checkmark {
  background: var(--accent);
  border-color: var(--accent);
}

.checkbox-label input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.test-result {
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.test-result.success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.test-result.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.data-info {
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.storage-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.storage-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}

.storage-text {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.settings-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.btn-danger {
  background: var(--error);
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hidden {
  display: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-modal {
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
    height: 100vh;
  }
  
  .settings-content {
    flex-direction: column;
  }
  
  .settings-sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .nav-item {
    flex-shrink: 0;
    white-space: nowrap;
  }
  
  .settings-footer {
    flex-direction: column;
  }
}
</style>