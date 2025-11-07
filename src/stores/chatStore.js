import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendMessage as sendMinimaxMessage } from '@/services/minimaxService'
import { v4 as uuidv4 } from 'uuid'

export const useChatStore = defineStore('chat', () => {
  // State
  const conversations = ref([])
  const currentConversationId = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Getters
  const currentConversation = computed(() => {
    return conversations.value.find(conv => conv.id === currentConversationId.value)
  })
  
  const currentMessages = computed(() => {
    return currentConversation.value?.messages || []
  })
  
  const conversationCount = computed(() => conversations.value.length)
  
  // Actions
  const createNewConversation = (title = 'New Conversation') => {
    const newConversation = {
      id: uuidv4(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: 'minimax-m2',
      settings: {
        temperature: 0.7,
        maxTokens: 2048
      }
    }
    
    conversations.value.unshift(newConversation)
    currentConversationId.value = newConversation.id
    
    return newConversation
  }
  
  const setCurrentConversation = (conversationId) => {
    const conversation = conversations.value.find(conv => conv.id === conversationId)
    if (conversation) {
      currentConversationId.value = conversationId
    }
  }
  
  const addMessage = async (message) => {
    if (!currentConversation.value) {
      createNewConversation()
    }
    
    const conversation = currentConversation.value
    const newMessage = {
      ...message,
      id: message.id || uuidv4(),
      timestamp: message.timestamp || new Date().toISOString()
    }
    
    conversation.messages.push(newMessage)
    conversation.updatedAt = new Date().toISOString()
    
    // Update conversation title if it's the first message
    if (conversation.messages.length === 1 && message.role === 'user') {
      const title = message.content.length > 50 
        ? message.content.substring(0, 50) + '...' 
        : message.content
      conversation.title = title
    }
    
    return newMessage
  }
  
  const removeMessage = (messageId) => {
    if (!currentConversation.value) return
    
    const conversation = currentConversation.value
    const messageIndex = conversation.messages.findIndex(msg => msg.id === messageId)
    
    if (messageIndex !== -1) {
      conversation.messages.splice(messageIndex, 1)
      conversation.updatedAt = new Date().toISOString()
    }
  }
  
  const updateMessage = (messageId, updates) => {
    if (!currentConversation.value) return
    
    const conversation = currentConversation.value
    const message = conversation.messages.find(msg => msg.id === messageId)
    
    if (message) {
      Object.assign(message, updates)
      conversation.updatedAt = new Date().toISOString()
    }
  }
  
  const sendMessage = async (content, options = {}) => {
    if (!currentConversation.value) {
      createNewConversation()
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const conversation = currentConversation.value
      const messageHistory = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // Add the new user message to history
      messageHistory.push({
        role: 'user',
        content
      })
      
      // Send to MiniMax API
      const response = await sendMinimaxMessage({
        messages: messageHistory,
        model: options.model || conversation.model,
        max_tokens: options.maxTokens || conversation.settings.maxTokens,
        temperature: options.temperature || conversation.settings.temperature,
        stream: false
      })
      
      return response.content
      
    } catch (err) {
      error.value = err.message || 'Failed to send message'
      console.error('Error sending message:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const retryMessage = async (messageId) => {
    const message = currentMessages.value.find(msg => msg.id === messageId)
    if (!message || message.role !== 'user') return
    
    // Find the last user message before this one
    const messages = currentMessages.value
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    
    if (messageIndex === -1) return
    
    // Remove any assistant messages that came after this user message
    for (let i = messageIndex + 1; i < messages.length; i++) {
      if (messages[i].role === 'assistant') {
        removeMessage(messages[i].id)
      }
    }
    
    // Retry sending the message
    return await sendMessage(message.content)
  }
  
  const clearCurrentConversation = () => {
    if (!currentConversation.value) return
    
    currentConversation.value.messages = []
    currentConversation.value.updatedAt = new Date().toISOString()
    currentConversation.value.title = 'New Conversation'
  }
  
  const deleteConversation = (conversationId) => {
    const index = conversations.value.findIndex(conv => conv.id === conversationId)
    
    if (index !== -1) {
      conversations.value.splice(index, 1)
      
      // If we deleted the current conversation, switch to another one
      if (currentConversationId.value === conversationId) {
        if (conversations.value.length > 0) {
          currentConversationId.value = conversations.value[0].id
        } else {
          currentConversationId.value = null
          createNewConversation()
        }
      }
    }
  }
  
  const updateConversationSettings = (settings) => {
    if (!currentConversation.value) return
    
    Object.assign(currentConversation.value.settings, settings)
    currentConversation.value.updatedAt = new Date().toISOString()
  }
  
  const duplicateConversation = (conversationId) => {
    const originalConversation = conversations.value.find(conv => conv.id === conversationId)
    if (!originalConversation) return
    
    const duplicatedConversation = {
      ...originalConversation,
      id: uuidv4(),
      title: originalConversation.title + ' (Copy)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [...originalConversation.messages.map(msg => ({ ...msg, id: uuidv4() }))]
    }
    
    conversations.value.unshift(duplicatedConversation)
    return duplicatedConversation
  }
  
  const exportConversation = (conversationId) => {
    const conversation = conversations.value.find(conv => conv.id === conversationId)
    if (!conversation) return null
    
    return {
      ...conversation,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  }
  
  const importConversation = (conversationData) => {
    try {
      // Validate conversation data
      if (!conversationData.messages || !Array.isArray(conversationData.messages)) {
        throw new Error('Invalid conversation data')
      }
      
      // Create new conversation with imported data
      const newConversation = {
        id: uuidv4(),
        title: conversationData.title || 'Imported Conversation',
        messages: conversationData.messages.map(msg => ({
          ...msg,
          id: msg.id || uuidv4(),
          timestamp: msg.timestamp || new Date().toISOString()
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        model: conversationData.model || 'minimax-m2',
        settings: {
          temperature: conversationData.settings?.temperature || 0.7,
          maxTokens: conversationData.settings?.maxTokens || 2048,
          ...conversationData.settings
        }
      }
      
      conversations.value.unshift(newConversation)
      return newConversation
      
    } catch (err) {
      error.value = 'Failed to import conversation: ' + err.message
      throw err
    }
  }
  
  const loadConversations = () => {
    try {
      const saved = localStorage.getItem('chat-ui-conversations')
      if (saved) {
        const data = JSON.parse(saved)
        conversations.value = data.conversations || []
        currentConversationId.value = data.currentConversationId || null
      }
    } catch (err) {
      console.error('Error loading conversations:', err)
      // Initialize with empty state
      conversations.value = []
      currentConversationId.value = null
    }
  }
  
  const saveConversations = () => {
    try {
      const data = {
        conversations: conversations.value,
        currentConversationId: currentConversationId.value,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('chat-ui-conversations', JSON.stringify(data))
    } catch (err) {
      console.error('Error saving conversations:', err)
    }
  }
  
  const searchMessages = (query) => {
    if (!query.trim()) return []
    
    const results = []
    const searchTerm = query.toLowerCase()
    
    conversations.value.forEach(conversation => {
      conversation.messages.forEach(message => {
        if (message.content.toLowerCase().includes(searchTerm)) {
          results.push({
            conversationId: conversation.id,
            conversationTitle: conversation.title,
            messageId: message.id,
            message: message,
            match: message.content
          })
        }
      })
    })
    
    return results
  }
  
  const getMessageStats = () => {
    const totalMessages = conversations.value.reduce((sum, conv) => sum + conv.messages.length, 0)
    const userMessages = conversations.value.reduce((sum, conv) => 
      sum + conv.messages.filter(msg => msg.role === 'user').length, 0
    )
    const assistantMessages = conversations.value.reduce((sum, conv) => 
      sum + conv.messages.filter(msg => msg.role === 'assistant').length, 0
    )
    
    return {
      totalConversations: conversations.value.length,
      totalMessages,
      userMessages,
      assistantMessages,
      averageMessagesPerConversation: conversations.value.length > 0 
        ? Math.round(totalMessages / conversations.value.length) 
        : 0
    }
  }
  
  // Initialize with a new conversation if none exists
  const initialize = () => {
    if (conversations.value.length === 0) {
      createNewConversation()
    } else if (!currentConversationId.value && conversations.value.length > 0) {
      currentConversationId.value = conversations.value[0].id
    }
  }
  
  // Auto-save conversations every 30 seconds
  const startAutoSave = () => {
    setInterval(() => {
      saveConversations()
    }, 30000)
  }
  
  return {
    // State
    conversations,
    currentConversationId,
    isLoading,
    error,
    
    // Getters
    currentConversation,
    currentMessages,
    conversationCount,
    
    // Actions
    createNewConversation,
    setCurrentConversation,
    addMessage,
    removeMessage,
    updateMessage,
    sendMessage,
    retryMessage,
    clearCurrentConversation,
    deleteConversation,
    updateConversationSettings,
    duplicateConversation,
    exportConversation,
    importConversation,
    loadConversations,
    saveConversations,
    searchMessages,
    getMessageStats,
    initialize,
    startAutoSave
  }
})