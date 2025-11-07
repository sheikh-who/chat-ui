<template>
  <div class="chat-page">
    <!-- Chat Container -->
    <div class="chat-container">
      <!-- Sidebar -->
      <aside class="chat-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-content">
          <!-- Sidebar Header -->
          <div class="sidebar-header">
            <h2>Conversations</h2>
            <button 
              @click="newConversation"
              class="btn btn-primary new-chat-btn"
              title="Start new conversation"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              New Chat
            </button>
          </div>
          
          <!-- Conversation List -->
          <div class="conversation-list">
            <div 
              v-for="conversation in conversations" 
              :key="conversation.id"
              :class="['conversation-item', { active: currentConversationId === conversation.id }]"
              @click="selectConversation(conversation.id)"
            >
              <div class="conversation-title">{{ conversation.title }}</div>
              <div class="conversation-meta">
                <span class="conversation-time">{{ formatDate(conversation.updatedAt) }}</span>
                <button 
                  @click.stop="deleteConversation(conversation.id)"
                  class="delete-btn"
                  title="Delete conversation"
                >
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- Main Chat Area -->
      <main class="chat-main">
        <!-- Chat Header -->
        <header class="chat-header">
          <div class="chat-header-left">
            <button 
              @click="sidebarCollapsed = !sidebarCollapsed"
              class="btn btn-ghost sidebar-toggle"
              title="Toggle sidebar"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            
            <div class="current-conversation">
              <h3>{{ currentConversation?.title || 'New Conversation' }}</h3>
              <div class="model-info">
                <ModelSelector 
                  v-model="selectedModel"
                  @change="handleModelChange"
                />
              </div>
            </div>
          </div>
          
          <div class="chat-header-right">
            <button 
              @click="exportConversation"
              class="btn btn-ghost"
              title="Export conversation"
              :disabled="!currentConversation || currentConversation.messages.length === 0"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </button>
            
            <button 
              @click="clearConversation"
              class="btn btn-ghost"
              title="Clear conversation"
              :disabled="!currentConversation || currentConversation.messages.length === 0"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </header>
        
        <!-- Messages Container -->
        <div 
          ref="messagesContainer"
          class="messages-container"
          :class="{ 'has-messages': messages.length > 0 }"
        >
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="welcome-message">
            <div class="welcome-content">
              <div class="welcome-icon">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2>Welcome to Chat-UI</h2>
              <p>Start a conversation with MiniMax M2 AI. Ask questions, get help, or just chat!</p>
              <div class="example-prompts">
                <h3>Example prompts:</h3>
                <div class="prompt-suggestions">
                  <button 
                    v-for="prompt in examplePrompts"
                    :key="prompt"
                    @click="usePrompt(prompt)"
                    class="prompt-btn"
                  >
                    {{ prompt }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Messages List -->
          <div v-else class="messages-list">
            <ChatMessage
              v-for="message in messages"
              :key="message.id"
              :message="message"
              @retry="retryMessage"
              @copy="copyMessage"
              @delete="deleteMessage"
            />
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="isTyping" class="typing-indicator">
            <div class="typing-content">
              <div class="typing-avatar">
                <div class="avatar">AI</div>
              </div>
              <div class="typing-text">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Message Input -->
        <div class="message-input-container">
          <MessageInput
            v-model="currentMessage"
            :disabled="isProcessing"
            :placeholder="`Message ${selectedModel}...`"
            @send="sendMessage"
            @keydown="handleKeydown"
          />
        </div>
      </main>
    </div>
    
    <!-- Settings Panel (if needed) -->
    <SettingsPanel v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatDate } from '@/utils/dateUtils'
import { exportConversation, downloadFile } from '@/utils/exportUtils'

import ChatMessage from '@/components/ChatMessage.vue'
import MessageInput from '@/components/MessageInput.vue'
import ModelSelector from '@/components/ModelSelector.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'

export default {
  name: 'ChatPage',
  components: {
    ChatMessage,
    MessageInput,
    ModelSelector,
    SettingsPanel
  },
  setup() {
    const chatStore = useChatStore()
    const settingsStore = useSettingsStore()
    
    // Reactive data
    const sidebarCollapsed = ref(false)
    const currentMessage = ref('')
    const isTyping = ref(false)
    const isProcessing = ref(false)
    const showSettings = ref(false)
    const selectedModel = ref(settingsStore.settings.defaultModel)
    const messagesContainer = ref(null)
    
    // Computed properties
    const messages = computed(() => chatStore.currentMessages)
    const currentConversation = computed(() => chatStore.currentConversation)
    const currentConversationId = computed(() => chatStore.currentConversationId)
    const conversations = computed(() => chatStore.conversations)
    
    // Example prompts
    const examplePrompts = [
      "What can you help me with?",
      "Explain quantum computing in simple terms",
      "Write a Python function to sort an array",
      "What's the difference between AI and machine learning?",
      "Tell me a joke about programming"
    ]
    
    // Methods
    const sendMessage = async () => {
      if (!currentMessage.value.trim() || isProcessing.value) return
      
      const message = currentMessage.value.trim()
      currentMessage.value = ''
      isProcessing.value = true
      
      try {
        // Add user message
        const userMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: message,
          timestamp: new Date()
        }
        
        await chatStore.addMessage(userMessage)
        
        // Add typing indicator
        isTyping.value = true
        
        // Get AI response
        const aiResponse = await chatStore.sendMessage(message, {
          model: selectedModel.value,
          maxTokens: settingsStore.settings.maxTokens,
          temperature: settingsStore.settings.temperature
        })
        
        // Add AI response
        if (aiResponse) {
          const aiMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
          }
          
          await chatStore.addMessage(aiMessage)
        }
        
      } catch (error) {
        console.error('Error sending message:', error)
        // Handle error (show toast notification, etc.)
      } finally {
        isProcessing.value = false
        isTyping.value = false
      }
    }
    
    const handleKeydown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    }
    
    const usePrompt = (prompt) => {
      currentMessage.value = prompt
      nextTick(() => {
        // Focus on input
        const input = document.querySelector('.message-input textarea')
        if (input) input.focus()
      })
    }
    
    const retryMessage = async (messageId) => {
      // Implementation for retrying a specific message
      console.log('Retrying message:', messageId)
    }
    
    const copyMessage = async (content) => {
      try {
        await navigator.clipboard.writeText(content)
        // Show success notification
      } catch (error) {
        console.error('Failed to copy text:', error)
      }
    }
    
    const deleteMessage = (messageId) => {
      chatStore.removeMessage(messageId)
    }
    
    const newConversation = () => {
      chatStore.createNewConversation()
    }
    
    const selectConversation = (conversationId) => {
      chatStore.setCurrentConversation(conversationId)
    }
    
    const deleteConversation = (conversationId) => {
      if (confirm('Are you sure you want to delete this conversation?')) {
        chatStore.deleteConversation(conversationId)
      }
    }
    
    const handleModelChange = (model) => {
      selectedModel.value = model
    }
    
    const clearConversation = () => {
      if (currentConversation.value && 
          confirm('Are you sure you want to clear this conversation?')) {
        chatStore.clearCurrentConversation()
      }
    }
    
    const exportCurrentConversation = () => {
      if (currentConversation.value) {
        const data = exportConversation(currentConversation.value)
        downloadFile(
          data, 
          `conversation-${Date.now()}.json`, 
          'application/json'
        )
      }
    }
    
    // Watchers
    watch(messages, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }, { deep: true })
    
    // Lifecycle
    onMounted(() => {
      // Load conversations from storage
      chatStore.loadConversations()
      
      // Auto-save conversations
      setInterval(() => {
        chatStore.saveConversations()
      }, 30000) // Save every 30 seconds
    })
    
    return {
      // Reactive data
      sidebarCollapsed,
      currentMessage,
      isTyping,
      isProcessing,
      showSettings,
      selectedModel,
      messagesContainer,
      
      // Computed
      messages,
      currentConversation,
      currentConversationId,
      conversations,
      examplePrompts,
      
      // Methods
      sendMessage,
      handleKeydown,
      usePrompt,
      retryMessage,
      copyMessage,
      deleteMessage,
      newConversation,
      selectConversation,
      deleteConversation,
      handleModelChange,
      clearConversation,
      exportConversation: exportCurrentConversation,
      formatDate
    }
  }
}
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chat-sidebar {
  width: 300px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.chat-sidebar.collapsed {
  transform: translateX(-100%);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.new-chat-btn {
  width: 100%;
  justify-content: center;
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.conversation-item {
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.conversation-item:hover {
  background: var(--bg-primary);
}

.conversation-item.active {
  background: var(--accent-soft);
  border: 1px solid var(--accent);
}

.conversation-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversation-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.conversation-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: var(--error);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle {
  padding: 0.5rem;
}

.current-conversation h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.model-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chat-header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.messages-container.has-messages {
  padding-bottom: 0;
}

.welcome-message {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.welcome-content {
  max-width: 600px;
  padding: 2rem;
}

.welcome-icon {
  margin-bottom: 1.5rem;
}

.welcome-icon .icon {
  width: 4rem;
  height: 4rem;
  color: var(--accent);
}

.welcome-content h2 {
  margin-bottom: 1rem;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-content p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.example-prompts h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.prompt-suggestions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.prompt-btn {
  text-align: left;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.prompt-btn:hover {
  background: var(--bg-primary);
  border-color: var(--accent);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.messages-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.typing-indicator {
  margin: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
}

.typing-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.typing-avatar .avatar {
  width: 2rem;
  height: 2rem;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.message-input-container {
  padding: 1rem 1.5rem;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 20;
    transform: translateX(-100%);
  }
  
  .chat-sidebar.collapsed {
    transform: translateX(-100%);
  }
  
  .chat-header {
    padding: 1rem;
  }
  
  .messages-container {
    padding: 0.5rem;
  }
  
  .message-input-container {
    padding: 0.5rem 1rem;
  }
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>