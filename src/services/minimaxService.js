import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import axios from 'axios'

class MiniMaxService {
  constructor() {
    this.anthropicClient = null
    this.openaiClient = null
    this.axiosInstance = null
    this.isConfigured = false
  }
  
  initialize(config) {
    const { apiKey, baseURL } = config
    
    if (!apiKey || !baseURL) {
      throw new Error('API key and base URL are required')
    }
    
    try {
      // Initialize Anthropic client (recommended)
      this.anthropicClient = new Anthropic({
        apiKey,
        baseURL: `${baseURL}/text`
      })
      
      // Initialize OpenAI client
      this.openaiClient = new OpenAI({
        apiKey,
        baseURL: `${baseURL}/text/v1`
      })
      
      // Initialize Axios for direct HTTP calls
      this.axiosInstance = axios.create({
        baseURL: `${baseURL}/text/v1`,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      })
      
      this.isConfigured = true
    } catch (error) {
      console.error('Failed to initialize MiniMax service:', error)
      throw error
    }
  }
  
  async sendMessage(messageData) {
    if (!this.isConfigured) {
      throw new Error('MiniMax service not initialized')
    }
    
    const { messages, model, max_tokens, temperature, stream = false, ...otherParams } = messageData
    
    try {
      // Try Anthropic client first (recommended)
      if (this.anthropicClient) {
        return await this.sendAnthropicMessage({
          messages,
          model,
          max_tokens,
          temperature,
          stream,
          ...otherParams
        })
      }
      
      // Fallback to OpenAI client
      if (this.openaiClient) {
        return await this.sendOpenAIMessage({
          messages,
          model,
          max_tokens,
          temperature,
          stream,
          ...otherParams
        })
      }
      
      // Fallback to direct HTTP calls
      return await this.sendDirectMessage({
        messages,
        model,
        max_tokens,
        temperature,
        ...otherParams
      })
      
    } catch (error) {
      console.error('Error sending message:', error)
      throw this.handleError(error)
    }
  }
  
  async sendAnthropicMessage(params) {
    try {
      const response = await this.anthropicClient.messages.create({
        model: params.model || 'minimax-m2',
        messages: params.messages,
        max_tokens: params.max_tokens || 2048,
        temperature: params.temperature || 0.7,
        stream: params.stream || false,
        stop_sequences: params.stop_sequences,
        system: params.system,
        top_p: params.top_p,
        top_k: params.top_k
      })
      
      if (params.stream) {
        return this.handleAnthropicStream(response)
      } else {
        return {
          content: response.content[0].text,
          role: 'assistant',
          model: response.model,
          usage: {
            input_tokens: response.usage.input_tokens,
            output_tokens: response.usage.output_tokens
          },
          finish_reason: response.stop_reason
        }
      }
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw error
    }
  }
  
  async sendOpenAIMessage(params) {
    try {
      const response = await this.openaiClient.chat.completions.create({
        model: params.model || 'minimax-m2',
        messages: params.messages,
        max_tokens: params.max_tokens || 2048,
        temperature: params.temperature || 0.7,
        stream: params.stream || false,
        stop: params.stop_sequences,
        top_p: params.top_p,
        top_k: params.top_k,
        frequency_penalty: params.frequency_penalty,
        presence_penalty: params.presence_penalty
      })
      
      if (params.stream) {
        return this.handleOpenAIStream(response)
      } else {
        return {
          content: response.choices[0].message.content,
          role: 'assistant',
          model: response.model,
          usage: {
            input_tokens: response.usage.prompt_tokens,
            output_tokens: response.usage.completion_tokens
          },
          finish_reason: response.choices[0].finish_reason
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
  }
  
  async sendDirectMessage(params) {
    try {
      const response = await this.axiosInstance.post('/chat/completions', {
        model: params.model || 'minimax-m2',
        messages: params.messages,
        max_tokens: params.max_tokens || 2048,
        temperature: params.temperature || 0.7,
        stream: params.stream || false,
        stop: params.stop_sequences,
        top_p: params.top_p,
        top_k: params.top_k,
        frequency_penalty: params.frequency_penalty,
        presence_penalty: params.presence_penalty
      })
      
      return {
        content: response.data.choices[0].message.content,
        role: 'assistant',
        model: response.data.model,
        usage: {
          input_tokens: response.data.usage.prompt_tokens,
          output_tokens: response.data.usage.completion_tokens
        },
        finish_reason: response.data.choices[0].finish_reason
      }
    } catch (error) {
      console.error('Direct API error:', error)
      throw error
    }
  }
  
  async *handleAnthropicStream(stream) {
    try {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
          yield {
            type: 'text',
            content: chunk.delta.text
          }
        } else if (chunk.type === 'message_delta' && chunk.delta?.stop_reason) {
          yield {
            type: 'stop',
            reason: chunk.delta.stop_reason
          }
        }
      }
    } catch (error) {
      console.error('Error handling Anthropic stream:', error)
      throw error
    }
  }
  
  async *handleOpenAIStream(stream) {
    try {
      for await (const chunk of stream) {
        if (chunk.choices?.[0]?.delta?.content) {
          yield {
            type: 'text',
            content: chunk.choices[0].delta.content
          }
        }
        if (chunk.choices?.[0]?.finish_reason) {
          yield {
            type: 'stop',
            reason: chunk.choices[0].finish_reason
          }
        }
      }
    } catch (error) {
      console.error('Error handling OpenAI stream:', error)
      throw error
    }
  }
  
  async getModels() {
    try {
      // Try to fetch from API
      if (this.axiosInstance) {
        const response = await this.axiosInstance.get('/models')
        return response.data.data
      }
      
      // Fallback to known models
      return [
        {
          id: 'minimax-m2',
          object: 'model',
          created: 1642018789,
          owned_by: 'minimax',
          permission: [],
          root: 'minimax-m2',
          parent: null
        },
        {
          id: 'minimax-m2-stable',
          object: 'model',
          created: 1642018789,
          owned_by: 'minimax',
          permission: [],
          root: 'minimax-m2-stable',
          parent: null
        }
      ]
    } catch (error) {
      console.error('Error fetching models:', error)
      throw error
    }
  }
  
  async getAccount() {
    if (!this.isConfigured) {
      throw new Error('Service not initialized')
    }
    
    try {
      if (this.axiosInstance) {
        const response = await this.axiosInstance.get('/account')
        return response.data
      }
      
      // Return mock account info
      return {
        object: 'account',
        id: 'account_123',
        name: 'MiniMax User',
        email: 'user@example.com'
      }
    } catch (error) {
      console.error('Error fetching account info:', error)
      throw error
    }
  }
  
  handleError(error) {
    if (error.response) {
      // API error response
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.error || 'API Error'
      
      const errorMap = {
        400: 'Bad Request - Check your request parameters',
        401: 'Unauthorized - Invalid API key',
        403: 'Forbidden - Access denied',
        404: 'Not Found - Resource not found',
        429: 'Too Many Requests - Rate limit exceeded',
        500: 'Internal Server Error - Please try again later',
        502: 'Bad Gateway - Service temporarily unavailable',
        503: 'Service Unavailable - Please try again later'
      }
      
      return new Error(errorMap[status] || message)
    } else if (error.request) {
      // Network error
      return new Error('Network Error - Please check your connection')
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
  
  // Utility methods
  isValidAPIKey(apiKey) {
    return apiKey && typeof apiKey === 'string' && apiKey.length > 0
  }
  
  isValidURL(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  
  async testConnection(config) {
    try {
      // Store current config
      const originalConfig = {
        anthropic: this.anthropicClient,
        openai: this.openaiClient,
        axios: this.axiosInstance
      }
      
      // Initialize with test config
      this.initialize(config)
      
      // Test the connection
      await this.getAccount()
      
      // Restore original config
      this.anthropicClient = originalConfig.anthropic
      this.openaiClient = originalConfig.openai
      this.axiosInstance = originalConfig.axios
      
      return {
        success: true,
        message: 'Connection successful'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

// Create singleton instance
const minimaxService = new MiniMaxService()

// Export for use in other modules
export const { initialize, sendMessage, getModels, getAccount, testConnection } = minimaxService
export { minimaxService }

// Default export
export default minimaxService