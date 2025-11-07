<template>
  <div class="settings-page">
    <div class="container">
      <h1 class="page-title">Settings</h1>
      
      <div class="settings-content">
        <div class="settings-nav">
          <nav class="settings-nav-list">
            <a 
              href="#" 
              v-for="section in settingSections" 
              :key="section.id"
              :class="['settings-nav-item', { active: activeSection === section.id }]"
              @click.prevent="activeSection = section.id"
            >
              <Icon :name="section.icon" class="nav-icon" />
              {{ section.name }}
            </a>
          </nav>
        </div>
        
        <div class="settings-panel">
          <!-- API Settings -->
          <div v-if="activeSection === 'api'" class="settings-section">
            <h2>API Configuration</h2>
            <p class="section-description">Configure your MiniMax API credentials and settings</p>
            
            <div class="setting-group">
              <label for="apiKey" class="setting-label">
                API Key
                <span class="required">*</span>
              </label>
              <div class="input-group">
                <input
                  id="apiKey"
                  v-model="settings.apiKey"
                  type="password"
                  class="form-input"
                  placeholder="Enter your MiniMax API key"
                  :class="{ 'error': errors.apiKey }"
                />
                <button 
                  @click="togglePasswordVisibility('apiKey')" 
                  class="btn-icon"
                  type="button"
                >
                  <Icon :name="showPasswords.apiKey ? 'eye-off' : 'eye'" />
                </button>
              </div>
              <p v-if="errors.apiKey" class="error-text">{{ errors.apiKey }}</p>
            </div>
            
            <div class="setting-group">
              <label for="baseUrl" class="setting-label">
                API Base URL
                <span class="required">*</span>
              </label>
              <input
                id="baseUrl"
                v-model="settings.baseURL"
                type="url"
                class="form-input"
                placeholder="https://api.minimax.chat"
                :class="{ 'error': errors.baseURL }"
              />
              <p v-if="errors.baseURL" class="error-text">{{ errors.baseURL }}</p>
              <p class="help-text">
                Default: https://api.minimax.chat (or your custom endpoint)
              </p>
            </div>
            
            <div class="setting-group">
              <label for="model" class="setting-label">Default Model</label>
              <select id="model" v-model="settings.defaultModel" class="form-select">
                <option value="MiniMax-M2">MiniMax-M2</option>
                <option value="MiniMax-M2-Stable">MiniMax-M2-Stable</option>
              </select>
              <p class="help-text">
                Choose the default model for conversations
              </p>
            </div>
            
            <div class="button-group">
              <button @click="testConnection" class="btn btn-secondary" :disabled="isTesting">
                <Icon name="connection" />
                {{ isTesting ? 'Testing...' : 'Test Connection' }}
              </button>
              <button @click="saveSettings" class="btn btn-primary">
                <Icon name="save" />
                Save Settings
              </button>
            </div>
          </div>
          
          <!-- Model Settings -->
          <div v-if="activeSection === 'model'" class="settings-section">
            <h2>Model Parameters</h2>
            <p class="section-description">Fine-tune AI behavior and response generation</p>
            
            <div class="setting-group">
              <label for="temperature" class="setting-label">
                Temperature: {{ settings.temperature }}
              </label>
              <input
                id="temperature"
                v-model.number="settings.temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="form-range"
              />
              <div class="range-labels">
                <span>Focused</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
              <p class="help-text">
                Controls randomness: 0 = deterministic, 2 = very creative
              </p>
            </div>
            
            <div class="setting-group">
              <label for="maxTokens" class="setting-label">
                Max Tokens
              </label>
              <input
                id="maxTokens"
                v-model.number="settings.maxTokens"
                type="number"
                min="1"
                max="8192"
                class="form-input"
              />
              <p class="help-text">
                Maximum response length (1-8192 tokens)
              </p>
            </div>
            
            <div class="setting-group">
              <label for="topP" class="setting-label">
                Top P: {{ settings.topP }}
              </label>
              <input
                id="topP"
                v-model.number="settings.topP"
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="form-range"
              />
              <p class="help-text">
                Nucleus sampling: considers only tokens with cumulative probability > topP
              </p>
            </div>
          </div>
          
          <!-- AI SDK 6 Beta Settings -->
          <div v-if="activeSection === 'sdk'" class="settings-section">
            <h2>AI SDK 6 Beta Features</h2>
            <p class="section-description">Enhanced capabilities powered by AI SDK 6 Beta</p>
            
            <div class="setting-group">
              <div class="checkbox-group">
                <input
                  id="enableTools"
                  v-model="settings.enableAIProvider"
                  type="checkbox"
                  class="form-checkbox"
                />
                <label for="enableTools" class="setting-label">
                  Enable AI SDK 6 Beta Provider
                </label>
              </div>
              <p class="help-text">
                Use AI SDK 6 Beta's unified provider for enhanced tool calling and structured output
              </p>
            </div>
            
            <div class="setting-group">
              <label for="defaultUseCase" class="setting-label">Default Use Case</label>
              <select 
                id="defaultUseCase" 
                v-model="settings.defaultUseCase" 
                class="form-select"
                :disabled="!settings.enableAIProvider"
              >
                <option value="general">General Assistant</option>
                <option value="weather">Weather Assistant</option>
                <option value="calculation">Calculator</option>
                <option value="search">Search Assistant</option>
                <option value="assistant">Multi-Tool Assistant</option>
              </select>
              <p class="help-text">
                Default tool set for new conversations
              </p>
            </div>
            
            <div class="setting-group">
              <div class="checkbox-group">
                <input
                  id="enableApproval"
                  v-model="settings.enableToolApproval"
                  type="checkbox"
                  class="form-checkbox"
                  :disabled="!settings.enableAIProvider"
                />
                <label for="enableApproval" class="setting-label">
                  Enable Tool Execution Approval
                </label>
              </div>
              <p class="help-text">
                Request user confirmation before executing tools (human-in-the-loop)
              </p>
            </div>
            
            <div class="setting-group">
              <div class="checkbox-group">
                <input
                  id="enableStructuredOutput"
                  v-model="settings.enableStructuredOutput"
                  type="checkbox"
                  class="form-checkbox"
                  :disabled="!settings.enableAIProvider"
                />
                <label for="enableStructuredOutput" class="setting-label">
                  Enable Structured Output
                </label>
              </div>
              <p class="help-text">
                Generate structured data alongside text responses
              </p>
            </div>
            
            <div class="setting-group">
              <label for="maxSteps" class="setting-label">
                Max Tool Steps: {{ settings.maxToolSteps }}
              </label>
              <input
                id="maxSteps"
                v-model.number="settings.maxToolSteps"
                type="range"
                min="1"
                max="10"
                step="1"
                class="form-range"
                :disabled="!settings.enableAIProvider"
              />
              <p class="help-text">
                Maximum number of tool calls and iterations
              </p>
            </div>
          </div>
          
          <!-- UI Settings -->
          <div v-if="activeSection === 'ui'" class="settings-section">
            <h2>User Interface</h2>
            <p class="section-description">Customize the appearance and behavior</p>
            
            <div class="setting-group">
              <label for="theme" class="setting-label">Theme</label>
              <select id="theme" v-model="settings.theme" class="form-select">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            
            <div class="setting-group">
              <label for="language" class="setting-label">Language</label>
              <select id="language" v-model="settings.language" class="form-select">
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            
            <div class="setting-group">
              <div class="checkbox-group">
                <input
                  id="enableAnimations"
                  v-model="settings.enableAnimations"
                  type="checkbox"
                  class="form-checkbox"
                />
                <label for="enableAnimations" class="setting-label">
                  Enable Animations
                </label>
              </div>
            </div>
            
            <div class="setting-group">
              <div class="checkbox-group">
                <input
                  id="enableSounds"
                  v-model="settings.enableSounds"
                  type="checkbox"
                  class="form-checkbox"
                />
                <label for="enableSounds" class="setting-label">
                  Enable Sound Effects
                </label>
              </div>
            </div>
          </div>
          
          <!-- Data Management -->
          <div v-if="activeSection === 'data'" class="settings-section">
            <h2>Data Management</h2>
            <p class="section-description">Export, import, and manage your chat data</p>
            
            <div class="button-group">
              <button @click="exportConversations" class="btn btn-secondary">
                <Icon name="download" />
                Export Conversations
              </button>
              <button @click="exportSettings" class="btn btn-secondary">
                <Icon name="settings" />
                Export Settings
              </button>
            </div>
            
            <div class="setting-group">
              <label for="importFile" class="setting-label">Import Data</label>
              <input
                id="importFile"
                type="file"
                accept=".json"
                @change="handleImport"
                class="form-file"
              />
              <p class="help-text">
                Import conversations or settings from a JSON file
              </p>
            </div>
            
            <div class="setting-group">
              <button @click="clearAllData" class="btn btn-danger">
                <Icon name="trash" />
                Clear All Data
              </button>
              <p class="help-text">
                This will permanently delete all conversations and settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settingsStore'
import { useChatStore } from '@/stores/chatStore'
import { exportConversationsToJSON, exportSettingsToJSON, importFromJSON } from '@/utils/exportUtils'
import Icon from '@/components/Icon.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const chatStore = useChatStore()

// Settings sections
const settingSections = [
  { id: 'api', name: 'API Configuration', icon: 'key' },
  { id: 'model', name: 'Model Parameters', icon: 'brain' },
  { id: 'sdk', name: 'AI SDK 6 Beta', icon: 'sparkles' },
  { id: 'ui', name: 'User Interface', icon: 'palette' },
  { id: 'data', name: 'Data Management', icon: 'database' }
]

const activeSection = ref('api')
const isTesting = ref(false)
const showPasswords = reactive({
  apiKey: false
})

// Settings data
const settings = reactive({
  apiKey: '',
  baseURL: 'https://api.minimax.chat',
  defaultModel: 'MiniMax-M2',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  theme: 'auto',
  language: 'en',
  enableAnimations: true,
  enableSounds: true,
  // AI SDK 6 Beta settings
  enableAIProvider: true,
  enableToolApproval: false,
  enableStructuredOutput: true,
  defaultUseCase: 'general',
  maxToolSteps: 5
})

// Validation errors
const errors = reactive({
  apiKey: '',
  baseURL: ''
})

// Load settings on mount
onMounted(() => {
  const savedSettings = settingsStore.settings
  if (savedSettings) {
    Object.assign(settings, savedSettings)
  }
})

// Computed properties
const canTestConnection = computed(() => {
  return settings.apiKey.trim() && settings.baseURL.trim()
})

// Methods
const togglePasswordVisibility = (field) => {
  showPasswords[field] = !showPasswords[field]
}

const validateSettings = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  if (!settings.apiKey.trim()) {
    errors.apiKey = 'API key is required'
    isValid = false
  }
  
  if (!settings.baseURL.trim()) {
    errors.baseURL = 'Base URL is required'
    isValid = false
  } else {
    try {
      new URL(settings.baseURL)
    } catch {
      errors.baseURL = 'Please enter a valid URL'
      isValid = false
    }
  }
  
  return isValid
}

const testConnection = async () => {
  if (!validateSettings()) return
  
  isTesting.value = true
  
  try {
    // Test connection using the service
    const { minimaxService } = await import('@/services/minimaxService')
    const result = await minimaxService.testConnection({
      apiKey: settings.apiKey,
      baseURL: settings.baseURL
    })
    
    if (result.success) {
      // Show success message
      alert('Connection test successful!')
    } else {
      // Show error message
      alert(`Connection test failed: ${result.message}`)
    }
  } catch (error) {
    alert(`Connection test failed: ${error.message}`)
  } finally {
    isTesting.value = false
  }
}

const saveSettings = () => {
  if (!validateSettings()) return
  
  try {
    settingsStore.updateSettings(settings)
    alert('Settings saved successfully!')
  } catch (error) {
    alert(`Failed to save settings: ${error.message}`)
  }
}

const exportConversations = () => {
  try {
    const data = exportConversationsToJSON()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversations-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    alert(`Export failed: ${error.message}`)
  }
}

const exportSettings = () => {
  try {
    const data = exportSettingsToJSON(settings)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    alert(`Export failed: ${error.message}`)
  }
}

const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    
    // Check if it's conversations or settings
    if (data.conversations) {
      // Import conversations
      importFromJSON(data)
      alert('Conversations imported successfully!')
    } else {
      // Import settings
      Object.assign(settings, data)
      alert('Settings imported successfully!')
    }
  } catch (error) {
    alert(`Import failed: ${error.message}`)
  }
  
  // Clear file input
  event.target.value = ''
}

const clearAllData = () => {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    try {
      // Clear all conversations
      chatStore.clearAllConversations()
      
      // Clear settings except API key
      const keepApiKey = settings.apiKey
      Object.assign(settings, {
        apiKey: keepApiKey,
        baseURL: 'https://api.minimax.chat',
        defaultModel: 'MiniMax-M2',
        temperature: 0.7,
        maxTokens: 2048,
        topP: 0.9,
        theme: 'auto',
        language: 'en',
        enableAnimations: true,
        enableSounds: true,
        enableAIProvider: true,
        enableToolApproval: false,
        enableStructuredOutput: true,
        defaultUseCase: 'general',
        maxToolSteps: 5
      })
      
      settingsStore.updateSettings(settings)
      alert('All data cleared successfully!')
    } catch (error) {
      alert(`Clear data failed: ${error.message}`)
    }
  }
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.settings-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}

.settings-nav {
  border-right: 1px solid var(--border-color);
  padding-right: 1rem;
}

.settings-nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.settings-nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.settings-nav-item.active {
  background: var(--primary-color);
  color: white;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.settings-panel {
  padding-left: 1rem;
}

.settings-section {
  margin-bottom: 3rem;
}

.settings-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.required {
  color: var(--error-color);
  margin-left: 0.25rem;
}

.input-group {
  position: relative;
  display: flex;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-input.error {
  border-color: var(--error-color);
}

.btn-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
}

.form-range {
  width: 100%;
  margin: 0.5rem 0;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.form-checkbox {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.form-file {
  width: 100%;
  padding: 0.75rem;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.error-text {
  color: var(--error-color);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.help-text {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
}

.btn-danger {
  background: var(--error-color);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

/* Dark theme overrides */
:root[data-theme="dark"] .settings-content,
:root[data-theme="dark"] .settings-nav {
  border-color: var(--border-color);
}

/* Responsive design */
@media (max-width: 768px) {
  .settings-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .settings-nav {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
  }
  
  .settings-nav-list {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .settings-nav-item {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .settings-panel {
    padding-left: 0;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>