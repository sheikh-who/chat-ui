<template>
  <div class="message-input">
    <div class="input-container">
      <div class="input-wrapper">
        <!-- Text Area -->
        <textarea
          ref="textareaRef"
          v-model="localValue"
          :disabled="disabled"
          :placeholder="placeholder"
          class="message-textarea"
          @input="handleInput"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
          rows="1"
        ></textarea>
        
        <!-- Character Count -->
        <div v-if="showCharacterCount" class="character-count">
          {{ localValue.length }} / {{ maxLength }}
        </div>
      </div>
      
      <!-- Send Button -->
      <button
        @click="handleSend"
        :disabled="!canSend || disabled"
        class="send-button"
        :class="{ 'is-sending': isSending }"
        title="Send message (Enter)"
      >
        <svg v-if="isSending" class="icon spinning" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2V6L16 2H12Z" />
        </svg>
        <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
    
    <!-- Quick Actions -->
    <div class="quick-actions" v-if="showQuickActions">
      <button
        v-for="action in quickActions"
        :key="action.label"
        @click="action.handler"
        class="quick-action-btn"
        :title="action.title"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          {{ action.icon }}
        </svg>
        <span class="action-label">{{ action.label }}</span>
      </button>
    </div>
    
    <!-- Status Messages -->
    <div class="input-status" v-if="statusMessage">
      <div :class="['status-message', statusType]">
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { uploadFile } from '@/services/fileService'

export default {
  name: 'MessageInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Type your message...'
    },
    maxLength: {
      type: Number,
      default: 4000
    },
    showCharacterCount: {
      type: Boolean,
      default: false
    },
    showQuickActions: {
      type: Boolean,
      default: true
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    isSending: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'send', 'keydown', 'focus', 'blur', 'upload'],
  setup(props, { emit }) {
    const textareaRef = ref(null)
    const localValue = ref(props.modelValue)
    const statusMessage = ref('')
    const statusType = ref('info')
    
    // Quick actions
    const quickActions = [
      {
        label: 'Upload',
        title: 'Upload file',
        icon: '<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />',
        handler: handleFileUpload
      },
      {
        label: 'Clear',
        title: 'Clear input',
        icon: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />',
        handler: clearInput
      }
    ]
    
    // Computed properties
    const canSend = computed(() => {
      return localValue.value.trim().length > 0 && 
             localValue.value.length <= props.maxLength &&
             !props.disabled
    })
    
    const isAtMaxLength = computed(() => {
      return localValue.value.length >= props.maxLength
    })
    
    const isNearMaxLength = computed(() => {
      return localValue.value.length >= props.maxLength * 0.9
    })
    
    // Methods
    const handleInput = (event) => {
      localValue.value = event.target.value
      emit('update:modelValue', localValue.value)
      
      if (props.autoResize) {
        resizeTextarea()
      }
    }
    
    const handleKeydown = (event) => {
      emit('keydown', event)
      
      // Handle special key combinations
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSend()
      }
    }
    
    const handleFocus = (event) => {
      emit('focus', event)
    }
    
    const handleBlur = (event) => {
      emit('blur', event)
    }
    
    const handleSend = () => {
      if (!canSend.value) return
      
      const message = localValue.value.trim()
      emit('send', message)
      
      // Clear input after sending
      localValue.value = ''
      emit('update:modelValue', '')
      
      if (props.autoResize) {
        resizeTextarea()
      }
    }
    
    const resizeTextarea = () => {
      nextTick(() => {
        const textarea = textareaRef.value
        if (textarea) {
          textarea.style.height = 'auto'
          textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
        }
      })
    }
    
    const clearInput = () => {
      localValue.value = ''
      emit('update:modelValue', '')
      showStatus('Input cleared', 'success')
    }
    
    const showStatus = (message, type = 'info', duration = 3000) => {
      statusMessage.value = message
      statusType.value = type
      
      if (duration > 0) {
        setTimeout(() => {
          statusMessage.value = ''
        }, duration)
      }
    }
    
    const handleFileUpload = async () => {
      try {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.multiple = true
        fileInput.accept = '.txt,.md,.json,.csv,.py,.js,.ts,.html,.css'
        
        fileInput.onchange = async (event) => {
          const files = Array.from(event.target.files)
          if (files.length > 0) {
            try {
              const uploadResults = await uploadFile(files)
              emit('upload', uploadResults)
              showStatus(`Uploaded ${files.length} file(s)`, 'success')
            } catch (error) {
              console.error('File upload error:', error)
              showStatus('File upload failed', 'error')
            }
          }
        }
        
        fileInput.click()
      } catch (error) {
        console.error('File upload error:', error)
        showStatus('File upload not supported', 'error')
      }
    }
    
    // Watchers
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== localValue.value) {
        localValue.value = newValue
        if (props.autoResize) {
          resizeTextarea()
        }
      }
    })
    
    watch(isAtMaxLength, (isAtMax) => {
      if (isAtMax) {
        showStatus('Message is at maximum length', 'warning', 2000)
      }
    })
    
    // Lifecycle
    onMounted(() => {
      if (props.autoResize) {
        resizeTextarea()
      }
      
      // Auto-focus on mount
      if (textareaRef.value && !props.disabled) {
        textareaRef.value.focus()
      }
    })
    
    return {
      textareaRef,
      localValue,
      statusMessage,
      statusType,
      quickActions,
      canSend,
      isAtMaxLength,
      isNearMaxLength,
      handleInput,
      handleKeydown,
      handleFocus,
      handleBlur,
      handleSend,
      resizeTextarea,
      clearInput,
      showStatus,
      handleFileUpload
    }
  }
}
</script>

<style scoped>
.message-input {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.input-container:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.message-textarea {
  width: 100%;
  min-height: 24px;
  max-height: 200px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  overflow-y: auto;
}

.message-textarea::placeholder {
  color: var(--text-muted);
}

.message-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.character-count {
  position: absolute;
  bottom: -1.5rem;
  right: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.character-count.warning {
  color: var(--warning);
}

.character-count.error {
  color: var(--error);
}

.send-button {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.send-button:disabled {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.send-button.is-sending {
  pointer-events: none;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background: var(--bg-primary);
  border-color: var(--border-hover);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.quick-action-btn .action-label {
  display: none;
}

@media (min-width: 768px) {
  .quick-action-btn .action-label {
    display: inline;
  }
}

.input-status {
  min-height: 1.25rem;
}

.status-message {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  animation: fadeIn 0.3s ease;
}

.status-message.info {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.status-message.success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-message.warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-message.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  border: 1px solid rgba(239, 68, 68, 0.3);
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

/* Responsive Design */
@media (max-width: 768px) {
  .input-container {
    padding: 0.5rem;
  }
  
  .send-button {
    width: 2rem;
    height: 2rem;
  }
  
  .quick-actions {
    justify-content: center;
  }
  
  .quick-action-btn {
    padding: 0.5rem;
  }
}

/* Dark theme adjustments */
[data-theme="dark"] .message-textarea {
  color: var(--text-primary);
}

[data-theme="dark"] .character-count {
  color: var(--text-muted);
}
</style>