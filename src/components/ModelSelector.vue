<template>
  <div class="model-selector">
    <select 
      :value="modelValue"
      @change="handleChange"
      class="model-select"
      :disabled="disabled"
    >
      <option 
        v-for="model in availableModels" 
        :key="model.id"
        :value="model.id"
        :disabled="!model.available"
      >
        {{ model.name }} {{ !model.available ? '(Unavailable)' : '' }}
      </option>
    </select>
    
    <div class="model-info" v-if="currentModel">
      <div class="model-stats">
        <span class="stat-item">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          {{ formatNumber(currentModel.contextWindow) }} tokens
        </span>
        <span class="stat-item">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          {{ currentModel.category }}
        </span>
        <span class="stat-item" v-if="currentModel.experimental">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </svg>
          Experimental
        </span>
      </div>
      
      <div class="model-description" v-if="currentModel.description">
        <p>{{ currentModel.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { formatNumber } from '@/utils/numberUtils'

export default {
  name: 'ModelSelector',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const availableModels = [
      {
        id: 'minimax-m2',
        name: 'MiniMax M2',
        contextWindow: 204800,
        category: 'General Purpose',
        description: 'Advanced conversational AI with excellent reasoning and dialogue capabilities',
        available: true,
        experimental: false
      },
      {
        id: 'minimax-m2-stable',
        name: 'MiniMax M2 Stable',
        contextWindow: 204800,
        category: 'Production',
        description: 'Stable version optimized for production use with reliable performance',
        available: true,
        experimental: false
      }
    ]
    
    const currentModel = computed(() => {
      return availableModels.find(model => model.id === props.modelValue)
    })
    
    const handleChange = (event) => {
      const newModel = event.target.value
      emit('update:modelValue', newModel)
      emit('change', newModel)
    }
    
    return {
      availableModels,
      currentModel,
      handleChange,
      formatNumber
    }
  }
}
</script>

<style scoped>
.model-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.model-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.model-select:hover {
  border-color: var(--border-hover);
}

.model-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
}

.model-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.model-info {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.model-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-item .icon {
  width: 1rem;
  height: 1rem;
  color: var(--accent);
}

.stat-item:last-child .icon {
  color: var(--warning);
}

.model-description {
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
}

.model-description p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .model-selector {
    min-width: 150px;
  }
  
  .model-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stat-item {
    justify-content: flex-start;
  }
}

/* Option styling */
.model-select option {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.model-select option:disabled {
  color: var(--text-muted);
  background: var(--bg-secondary);
}
</style>