import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref({
    // API Settings
    apiKey: '',
    baseURL: 'https://api.minimax.chat/v1',
    defaultModel: 'minimax-m2',
    
    // Model Settings
    maxTokens: 2048,
    temperature: 0.7,
    topP: 1.0,
    topK: 40,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    
    // UI Settings
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    showTimestamps: true,
    showMessageActions: true,
    autoScroll: true,
    compactMode: false,
    
    // Chat Settings
    autoSave: true,
    maxConversations: 100,
    maxMessagesPerConversation: 1000,
    autoTitle: true,
    confirmDelete: true,
    
    // Privacy Settings
    shareData: false,
    analyticsEnabled: true,
    errorReporting: true,
    
    // Advanced Settings
    debugMode: false,
    logLevel: 'info',
    streamResponses: true,
    showThinking: false
  })
  
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Getters
  const isDarkTheme = computed(() => settings.value.theme === 'dark')
  const isLightTheme = computed(() => settings.value.theme === 'light')
  const currentTheme = computed(() => settings.value.theme)
  const isAPICConfigured = computed(() => 
    settings.value.apiKey && settings.value.baseURL
  )
  
  // Default settings for reset
  const defaultSettings = {
    apiKey: '',
    baseURL: 'https://api.minimax.chat/v1',
    defaultModel: 'minimax-m2',
    maxTokens: 2048,
    temperature: 0.7,
    topP: 1.0,
    topK: 40,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    showTimestamps: true,
    showMessageActions: true,
    autoScroll: true,
    compactMode: false,
    autoSave: true,
    maxConversations: 100,
    maxMessagesPerConversation: 1000,
    autoTitle: true,
    confirmDelete: true,
    shareData: false,
    analyticsEnabled: true,
    errorReporting: true,
    debugMode: false,
    logLevel: 'info',
    streamResponses: true,
    showThinking: false
  }
  
  // Actions
  const updateSettings = (newSettings) => {
    Object.assign(settings.value, newSettings)
    saveSettings()
  }
  
  const updateSetting = (key, value) => {
    if (key in settings.value) {
      settings.value[key] = value
      saveSettings()
    }
  }
  
  const getSetting = (key, defaultValue = null) => {
    return settings.value[key] !== undefined ? settings.value[key] : defaultValue
  }
  
  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    saveSettings()
  }
  
  const loadSettings = () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Load from localStorage
      const savedSettings = localStorage.getItem('chat-ui-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        settings.value = { ...defaultSettings, ...parsed }
      }
      
      // Load theme preference
      loadThemePreference()
      
      isInitialized.value = true
    } catch (err) {
      console.error('Error loading settings:', err)
      error.value = 'Failed to load settings'
      settings.value = { ...defaultSettings }
    } finally {
      isLoading.value = false
    }
  }
  
  const saveSettings = () => {
    try {
      // Don't save sensitive data like API keys to localStorage in production
      const safeSettings = { ...settings.value }
      if (process.env.NODE_ENV === 'production') {
        // In production, don't save API keys
        safeSettings.apiKey = ''
      }
      
      localStorage.setItem('chat-ui-settings', JSON.stringify(safeSettings))
    } catch (err) {
      console.error('Error saving settings:', err)
    }
  }
  
  const loadThemePreference = () => {
    const savedTheme = localStorage.getItem('chat-ui-theme')
    if (savedTheme) {
      settings.value.theme = savedTheme
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      settings.value.theme = prefersDark ? 'dark' : 'light'
    }
  }
  
  const setTheme = (theme) => {
    if (theme === 'light' || theme === 'dark') {
      settings.value.theme = theme
      localStorage.setItem('chat-ui-theme', theme)
      
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme)
      saveSettings()
    }
  }
  
  const toggleTheme = () => {
    const newTheme = settings.value.theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }
  
  const getAPIConfig = () => {
    return {
      apiKey: settings.value.apiKey,
      baseURL: settings.value.baseURL,
      defaultModel: settings.value.defaultModel
    }
  }
  
  const getModelParams = () => {
    return {
      max_tokens: settings.value.maxTokens,
      temperature: settings.value.temperature,
      top_p: settings.value.topP,
      top_k: settings.value.topK,
      frequency_penalty: settings.value.frequencyPenalty,
      presence_penalty: settings.value.presencePenalty
    }
  }
  
  const getUIConfig = () => {
    return {
      theme: settings.value.theme,
      language: settings.value.language,
      fontSize: settings.value.fontSize,
      showTimestamps: settings.value.showTimestamps,
      showMessageActions: settings.value.showMessageActions,
      autoScroll: settings.value.autoScroll,
      compactMode: settings.value.compactMode
    }
  }
  
  const validateSettings = () => {
    const errors = []
    
    // Validate API settings
    if (!settings.value.apiKey) {
      errors.push('API key is required')
    }
    
    if (!settings.value.baseURL) {
      errors.push('Base URL is required')
    } else {
      try {
        new URL(settings.value.baseURL)
      } catch {
        errors.push('Invalid base URL format')
      }
    }
    
    // Validate numeric settings
    if (settings.value.maxTokens < 1 || settings.value.maxTokens > 4096) {
      errors.push('Max tokens must be between 1 and 4096')
    }
    
    if (settings.value.temperature < 0 || settings.value.temperature > 2) {
      errors.push('Temperature must be between 0 and 2')
    }
    
    if (settings.value.topP < 0 || settings.value.topP > 1) {
      errors.push('Top P must be between 0 and 1')
    }
    
    if (settings.value.topK < 1 || settings.value.topK > 100) {
      errors.push('Top K must be between 1 and 100')
    }
    
    // Validate limits
    if (settings.value.maxConversations < 1 || settings.value.maxConversations > 1000) {
      errors.push('Max conversations must be between 1 and 1000')
    }
    
    if (settings.value.maxMessagesPerConversation < 1 || settings.value.maxMessagesPerConversation > 10000) {
      errors.push('Max messages per conversation must be between 1 and 10000')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  const exportSettings = () => {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings: { ...settings.value }
    }
    
    // Remove sensitive data
    if (exportData.settings.apiKey) {
      exportData.settings.apiKey = '[REDACTED]'
    }
    
    return exportData
  }
  
  const importSettings = (importData) => {
    try {
      if (!importData || !importData.settings) {
        throw new Error('Invalid settings data')
      }
      
      // Merge with current settings
      const newSettings = { ...settings.value, ...importData.settings }
      
      // Update and save
      settings.value = newSettings
      saveSettings()
      
      return {
        success: true,
        message: 'Settings imported successfully'
      }
    } catch (err) {
      return {
        success: false,
        message: 'Failed to import settings: ' + err.message
      }
    }
  }
  
  const getStorageUsage = () => {
    try {
      // Get all storage data
      const settingsData = localStorage.getItem('chat-ui-settings') || ''
      const conversationsData = localStorage.getItem('chat-ui-conversations') || ''
      const themeData = localStorage.getItem('chat-ui-theme') || ''
      
      const totalSize = settingsData.length + conversationsData.length + themeData.length
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      return {
        used: totalSize,
        max: maxSize,
        percentage: (totalSize / maxSize) * 100,
        breakdown: {
          settings: settingsData.length,
          conversations: conversationsData.length,
          theme: themeData.length
        }
      }
    } catch (err) {
      console.error('Error calculating storage usage:', err)
      return {
        used: 0,
        max: 10 * 1024 * 1024,
        percentage: 0,
        breakdown: { settings: 0, conversations: 0, theme: 0 }
      }
    }
  }
  
  const clearAllData = () => {
    try {
      localStorage.removeItem('chat-ui-settings')
      localStorage.removeItem('chat-ui-conversations')
      localStorage.removeItem('chat-ui-theme')
      
      // Reset to defaults
      settings.value = { ...defaultSettings }
      
      return {
        success: true,
        message: 'All data cleared successfully'
      }
    } catch (err) {
      return {
        success: false,
        message: 'Failed to clear data: ' + err.message
      }
    }
  }
  
  const initialize = () => {
    if (!isInitialized.value) {
      loadSettings()
    }
  }
  
  return {
    // State
    settings,
    isInitialized,
    isLoading,
    error,
    
    // Getters
    isDarkTheme,
    isLightTheme,
    currentTheme,
    isAPICConfigured,
    
    // Actions
    updateSettings,
    updateSetting,
    getSetting,
    resetSettings,
    loadSettings,
    saveSettings,
    setTheme,
    toggleTheme,
    getAPIConfig,
    getModelParams,
    getUIConfig,
    validateSettings,
    exportSettings,
    importSettings,
    getStorageUsage,
    clearAllData,
    initialize
  }
})