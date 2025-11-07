<template>
  <div 
    :class="['chat-message', { 'is-user': message.role === 'user', 'is-assistant': message.role === 'assistant' }]"
  >
    <div class="message-avatar">
      <div v-if="message.role === 'user'" class="avatar user-avatar">
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      <div v-else class="avatar ai-avatar">
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    </div>
    
    <div class="message-content">
      <div class="message-header">
        <span class="message-role">
          {{ message.role === 'user' ? 'You' : 'Assistant' }}
        </span>
        <span class="message-time">
          {{ formatTime(message.timestamp) }}
        </span>
      </div>
      
      <div class="message-body">
        <div v-if="isEditing" class="message-edit">
          <textarea
            v-model="editContent"
            class="edit-textarea"
            @keydown="handleEditKeydown"
          ></textarea>
          <div class="edit-actions">
            <button @click="saveEdit" class="btn btn-primary btn-sm">Save</button>
            <button @click="cancelEdit" class="btn btn-secondary btn-sm">Cancel</button>
          </div>
        </div>
        
        <div v-else class="message-text" v-html="formattedContent"></div>
        
        <div v-if="message.status === 'error'" class="message-error">
          <span class="error-text">Error: {{ message.error || 'Failed to send message' }}</span>
        </div>
      </div>
      
      <div class="message-actions">
        <button 
          @click="copyMessage"
          class="action-btn"
          title="Copy message"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
        
        <button 
          @click="retryMessage"
          class="action-btn"
          title="Retry"
          v-if="message.role === 'assistant' && message.status === 'error'"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
          </svg>
        </button>
        
        <button 
          @click="startEdit"
          class="action-btn"
          title="Edit message"
          v-if="message.role === 'user'"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        
        <button 
          @click="deleteMessage"
          class="action-btn delete"
          title="Delete message"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { formatTime } from '@/utils/dateUtils'

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  emits: ['retry', 'copy', 'delete'],
  setup(props, { emit }) {
    const isEditing = ref(false)
    const editContent = ref('')
    
    const formattedContent = computed(() => {
      if (props.message.role === 'user') {
        return props.message.content
      }
      
      try {
        return marked(props.message.content)
      } catch (error) {
        console.error('Error formatting content:', error)
        return props.message.content
      }
    })
    
    const startEdit = () => {
      isEditing.value = true
      editContent.value = props.message.content
    }
    
    const saveEdit = () => {
      // Implementation for saving edited message
      console.log('Saving edited message:', editContent.value)
      isEditing.value = false
    }
    
    const cancelEdit = () => {
      isEditing.value = false
      editContent.value = ''
    }
    
    const handleEditKeydown = (event) => {
      if (event.key === 'Enter' && event.ctrlKey) {
        saveEdit()
      } else if (event.key === 'Escape') {
        cancelEdit()
      }
    }
    
    const copyMessage = () => {
      emit('copy', props.message.content)
    }
    
    const retryMessage = () => {
      emit('retry', props.message.id)
    }
    
    const deleteMessage = () => {
      if (confirm('Are you sure you want to delete this message?')) {
        emit('delete', props.message.id)
      }
    }
    
    return {
      isEditing,
      editContent,
      formattedContent,
      startEdit,
      saveEdit,
      cancelEdit,
      handleEditKeydown,
      copyMessage,
      retryMessage,
      deleteMessage,
      formatTime
    }
  }
}
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease-out;
}

.is-user {
  flex-direction: row-reverse;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  flex-shrink: 0;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ai-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.message-content {
  flex: 1;
  max-width: calc(100% - 3.5rem);
  position: relative;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.message-role {
  font-weight: 500;
  color: var(--text-primary);
}

.message-time {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.message-body {
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  position: relative;
}

.is-user .message-body {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.message-text {
  color: var(--text-secondary);
  line-height: 1.6;
}

.message-text :deep(code) {
  background: var(--bg-tertiary);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.message-text :deep(pre) {
  background: var(--bg-tertiary);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 0.5rem 0;
  border: 1px solid var(--border-color);
}

.message-text :deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
}

.message-text :deep(blockquote) {
  border-left: 4px solid var(--accent);
  padding-left: 1rem;
  margin: 0.5rem 0;
  color: var(--text-muted);
  font-style: italic;
}

.message-text :deep(ul), 
.message-text :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.message-text :deep(li) {
  margin: 0.25rem 0;
}

.message-text :deep(h1), 
.message-text :deep(h2), 
.message-text :deep(h3), 
.message-text :deep(h4), 
.message-text :deep(h5), 
.message-text :deep(h6) {
  margin: 1rem 0 0.5rem 0;
  color: var(--text-primary);
}

.message-error {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.375rem;
}

.error-text {
  color: var(--error);
  font-size: 0.875rem;
}

.message-edit {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
}

.edit-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.message-actions {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-message:hover .message-actions {
  opacity: 1;
}

.action-btn {
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.action-btn .icon {
  width: 1rem;
  height: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-message {
    gap: 0.75rem;
  }
  
  .message-content {
    max-width: calc(100% - 3rem);
  }
  
  .avatar {
    width: 2rem;
    height: 2rem;
  }
  
  .message-body {
    padding: 0.75rem;
  }
  
  .message-actions {
    opacity: 1;
  }
}
</style>