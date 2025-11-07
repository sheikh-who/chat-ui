import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import axios from 'axios'
import { createMiniMax } from '@ai-sdk/minimax'
import { streamText, generateText, tool, stepCountIs, lastAssistantMessageIsCompleteWithToolCalls } from 'ai'
import { z } from 'zod'

// AI SDK 6 Beta Agent Class
class MiniMaxAgent {
  constructor(config) {
    this.config = config
    this.minimaxProvider = null
    this.initializeProvider()
  }

  initializeProvider() {
    if (this.config.apiKey && this.config.baseURL) {
      this.minimaxProvider = createMiniMax({
        baseURL: this.config.baseURL,
        apiKey: this.config.apiKey,
        // MiniMax M2 model support
        defaultModel: this.config.model || 'MiniMax-M2'
      })
    }
  }

  // Enhanced streamText with tool calling and structured output
  async streamTextWithTools(messages, options = {}) {
    if (!this.minimaxProvider) {
      throw new Error('MiniMax provider not initialized')
    }

    const {
      model = 'MiniMax-M2',
      tools = {},
      stopWhen = stepCountIs(5),
      temperature = 0.7,
      maxTokens = 4096,
      system,
      ...otherParams
    } = options

    try {
      const result = streamText({
        model: this.minimaxProvider(model),
        messages: this.convertToModelMessages(messages),
        tools,
        stopWhen,
        temperature,
        maxTokens,
        system,
        ...otherParams
      })

      return result.toUIMessageStreamResponse()
    } catch (error) {
      console.error('AI SDK streamText error:', error)
      throw error
    }
  }

  // Enhanced generateText with tool calling
  async generateTextWithTools(messages, options = {}) {
    if (!this.minimaxProvider) {
      throw new Error('MiniMax provider not initialized')
    }

    const {
      model = 'MiniMax-M2',
      tools = {},
      stopWhen = stepCountIs(5),
      temperature = 0.7,
      maxTokens = 4096,
      system,
      output,
      ...otherParams
    } = options

    try {
      const result = await generateText({
        model: this.minimaxProvider(model),
        messages: this.convertToModelMessages(messages),
        tools,
        stopWhen,
        temperature,
        maxTokens,
        system,
        output,
        ...otherParams
      })

      return {
        text: result.text,
        usage: result.usage,
        toolCalls: result.toolCalls,
        steps: result.steps
      }
    } catch (error) {
      console.error('AI SDK generateText error:', error)
      throw error
    }
  }

  // Create reusable tools
  createTool(name, description, schema, execute) {
    return tool({
      description,
      inputSchema: schema,
      execute,
      // Enable tool execution approval for human-in-the-loop
      needsApproval: false // Set to true for sensitive operations
    })
  }

  // Common tool examples
  getWeatherTool() {
    return this.createTool(
      'getWeather',
      'Get weather information for a location',
      z.object({
        location: z.string().describe('The city or location to get weather for'),
        unit: z.enum(['celsius', 'fahrenheit']).default('celsius')
      }),
      async ({ location, unit = 'celsius' }) => {
        // Mock weather API call - replace with real weather service
        const temp = Math.round(Math.random() * 30 + 10) // 10-40°C
        return {
          location,
          temperature: unit === 'celsius' ? temp : Math.round(temp * 9/5 + 32),
          unit,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
          humidity: Math.round(Math.random() * 40 + 30), // 30-70%
          windSpeed: Math.round(Math.random() * 20 + 5) // 5-25 km/h
        }
      }
    )
  }

  getCalculatorTool() {
    return this.createTool(
      'calculate',
      'Perform basic mathematical calculations',
      z.object({
        expression: z.string().describe('Mathematical expression to evaluate')
      }),
      async ({ expression }) => {
        try {
          // Basic security: only allow safe math expressions
          const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '')
          const result = eval(sanitized) // Note: In production, use a proper math parser
          return {
            expression,
            result: isNaN(result) ? 'Invalid expression' : result
          }
        } catch (error) {
          return {
            expression,
            result: 'Error: Invalid expression',
            error: error.message
          }
        }
      }
    )
  }

  getSearchTool() {
    return this.createTool(
      'search',
      'Search for information',
      z.object({
        query: z.string().describe('Search query'),
        maxResults: z.number().default(5)
      }),
      async ({ query, maxResults = 5 }) => {
        // Mock search - replace with real search API
        return {
          query,
          results: [
            {
              title: `Result for "${query}"`,
              url: 'https://example.com',
              snippet: `This is a sample search result for "${query}"...`,
              score: 0.95
            }
          ]
        }
      }
    )
  }

  // Convert messages to AI SDK format
  convertToModelMessages(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  }

  // Get default tools for common use cases
  getDefaultTools(useCase = 'general') {
    const tools = {}

    switch (useCase) {
      case 'weather':
        tools.weather = this.getWeatherTool()
        break
      case 'calculation':
        tools.calculate = this.getCalculatorTool()
        break
      case 'search':
        tools.search = this.getSearchTool()
        break
      case 'assistant':
        tools.weather = this.getWeatherTool()
        tools.calculate = this.getCalculatorTool()
        tools.search = this.getSearchTool()
        break
      default:
        // General tools
        tools.calculate = this.getCalculatorTool()
    }

    return tools
  }
}

class MiniMaxService {
  constructor() {
    this.anthropicClient = null
    this.openaiClient = null
    this.axiosInstance = null
    this.isConfigured = false
    
    // AI SDK 6 Beta Agent
    this.agent = null
    this.minimaxProvider = null
  }
  
  initialize(config) {
    const { apiKey, baseURL, model } = config
    
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
      
      // Initialize AI SDK 6 Beta Agent
      this.agent = new MiniMaxAgent({
        apiKey,
        baseURL,
        model: model || 'MiniMax-M2'
      })
      
      this.isConfigured = true
    } catch (error) {
      console.error('Failed to initialize MiniMax service:', error)
      throw error
    }
  }
  
  // AI SDK 6 Beta Agent Methods
  async sendMessageWithAgent(messageData) {
    if (!this.isConfigured) {
      throw new Error('MiniMax service not initialized')
    }
    
    const { 
      messages, 
      model, 
      max_tokens, 
      temperature, 
      stream = false, 
      tools = {},
      useCase = 'general',
      ...otherParams 
    } = messageData
    
    try {
      // Get default tools for the use case if not provided
      const agentTools = Object.keys(tools).length > 0 ? tools : this.agent.getDefaultTools(useCase)
      
      if (stream) {
        return await this.agent.streamTextWithTools(messages, {
          model: model || 'MiniMax-M2',
          maxTokens: max_tokens || 4096,
          temperature: temperature || 0.7,
          tools: agentTools,
          ...otherParams
        })
      } else {
        return await this.agent.generateTextWithTools(messages, {
          model: model || 'MiniMax-M2',
          maxTokens: max_tokens || 4096,
          temperature: temperature || 0.7,
          tools: agentTools,
          ...otherParams
        })
      }
    } catch (error) {
      console.error('Error sending message with agent:', error)
      throw this.handleError(error)
    }
  }
  
  // Create structured output with AI SDK
  async generateStructuredOutput(messageData, schema) {
    if (!this.isConfigured) {
      throw new Error('MiniMax service not initialized')
    }
    
    const { 
      messages, 
      model, 
      max_tokens, 
      temperature,
      tools = {},
      ...otherParams 
    } = messageData
    
    try {
      const agentTools = Object.keys(tools).length > 0 ? tools : this.agent.getDefaultTools('general')
      
      const result = await this.agent.generateTextWithTools(messages, {
        model: model || 'MiniMax-M2',
        maxTokens: max_tokens || 4096,
        temperature: temperature || 0.7,
        tools: agentTools,
        output: schema, // Structured output schema
        stopWhen: stepCountIs(3), // Limit steps for structured output
        ...otherParams
      })
      
      return result
    } catch (error) {
      console.error('Error generating structured output:', error)
      throw this.handleError(error)
    }
  }
  
  // Multi-step conversation with tool approval
  async sendMessageWithApproval(messageData) {
    if (!this.isConfigured) {
      throw new Error('MiniMax service not initialized')
    }
    
    const { 
      messages, 
      model, 
      max_tokens, 
      temperature,
      tools = {},
      enableApproval = false,
      ...otherParams 
    } = messageData
    
    try {
      // Create tools with approval capability
      const agentTools = {}
      Object.entries(tools).forEach(([name, toolDef]) => {
        agentTools[name] = {
          ...toolDef,
          needsApproval: enableApproval
        }
      })
      
      // Add default tools if none provided
      if (Object.keys(agentTools).length === 0) {
        const defaultTools = this.agent.getDefaultTools('assistant')
        Object.entries(defaultTools).forEach(([name, toolDef]) => {
          agentTools[name] = {
            ...toolDef,
            needsApproval: enableApproval
          }
        })
      }
      
      return await this.agent.generateTextWithTools(messages, {
        model: model || 'MiniMax-M2',
        maxTokens: max_tokens || 4096,
        temperature: temperature || 0.7,
        tools: agentTools,
        stopWhen: lastAssistantMessageIsCompleteWithToolCalls, // Auto-continue when tool calls complete
        ...otherParams
      })
    } catch (error) {
      console.error('Error sending message with approval:', error)
      throw this.handleError(error)
    }
  }
  
  // Get agent capabilities
  getAgentCapabilities() {
    return {
      supportsStreaming: true,
      supportsToolCalling: true,
      supportsStructuredOutput: true,
      supportsApproval: true,
      supportsMultiStep: true,
      availableModels: ['MiniMax-M2', 'MiniMax-M2-Stable'],
      maxContextTokens: 204800,
      defaultTools: this.agent.getDefaultTools('assistant')
    }
  }
  
  // Create custom tool
  createCustomTool(name, description, schema, execute, needsApproval = false) {
    return this.agent.createTool(name, description, schema, execute, needsApproval)
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
export const { 
  initialize, 
  sendMessage, 
  sendMessageWithAgent,
  sendMessageWithApproval,
  generateStructuredOutput,
  getAgentCapabilities,
  createCustomTool,
  getModels, 
  getAccount, 
  testConnection 
} = minimaxService
export { minimaxService }

// Default export
export default minimaxService