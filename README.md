# Chat-UI: Conversational AI Interface

A modern, responsive chatbot interface powered by **MiniMax M2** with **AI SDK 6 Beta** integration, featuring advanced conversational capabilities, tool calling, and structured output.

## 🚀 Features

- **AI SDK 6 Beta Integration**: Enhanced with unified provider, agent interface, and structured output
- **Modern UI**: Clean, responsive design with dark/light mode  
- **MiniMax M2 Integration**: Powered by advanced text generation models (204,800 token context)
- **Real-time Chat**: Streaming responses with typing indicators
- **Tool Calling**: Advanced tool execution with approval workflows
- **Structured Output**: Generate JSON, arrays, and other structured data
- **Multi-step Conversations**: AI can make multiple tool calls and iterations
- **Agent Interface**: Standardized agent building with full execution control
- **Context Awareness**: Maintains conversation history and context
- **Multi-model Support**: Switch between different MiniMax models
- **Export/Import**: Save and restore conversation history
- **Customizable**: Theme and behavior customization

## 🆕 AI SDK 6 Beta Features

### Enhanced Capabilities
- **Unified Provider**: Provider-agnostic API that works with multiple LLM backends
- **Agent Interface**: Standardized way to build agents with tool loops and state management
- **Tool Execution Approval**: Human-in-the-loop patterns for sensitive operations
- **Structured Output (Stable)**: Generate structured data alongside text responses
- **Multi-step Generation**: Enable complex workflows with stop conditions

### Built-in Tools
- **Weather Assistant**: Get real-time weather information
- **Calculator**: Perform mathematical calculations
- **Search Assistant**: Find information from the web
- **Multi-Tool Assistant**: Combine multiple tools for complex tasks

### Use Cases
- **General Assistant**: Standard conversational AI with basic tools
- **Weather Assistant**: Focused on weather-related queries
- **Calculator**: Mathematical problem solving
- **Search Assistant**: Information retrieval and web search
- **Multi-Tool Assistant**: Complex multi-step reasoning tasks

## 🎯 Supported Models

| Model Name | Context Window | Description |
|------------|----------------|-------------|
| MiniMax-M2 | 204,800 tokens | Advanced conversational AI |
| MiniMax-M2-Stable | 204,800 tokens | Stable version for production |

## 🛠 Quick Start

### Prerequisites

- Node.js 18+ 
- Modern web browser
- MiniMax API credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/sheikh-who/chat-ui.git
cd chat-ui

# Install dependencies (includes AI SDK 6 Beta packages)
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MiniMax API credentials

# Start development server
npm run dev
```

### AI SDK 6 Beta Dependencies
- `ai@^3.0.0-beta.32` - Core AI SDK
- `@ai-sdk/vue@^3.0.0-beta.32` - Vue.js integration
- `@ai-sdk/minimax@^3.0.0-beta.32` - MiniMax provider
- `@ai-sdk/openai@^3.0.0-beta.32` - OpenAI provider
- `zod@^3.22.4` - Schema validation

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

1. **Start Chatting**: Enter your message in the input field and press Enter
2. **Toggle Models**: Use the model selector to switch between different AI models
3. **Clear Chat**: Click "Clear Chat" to start a new conversation
4. **Export**: Save your conversation history as JSON
5. **Import**: Load previously saved conversation files

## 🔧 Configuration

### Environment Variables

```env
# MiniMax API Configuration
VITE_MINIMAX_API_KEY=your_api_key_here
VITE_MINIMAX_BASE_URL=https://api.minimax.chat
VITE_MINIMAX_MODEL=MiniMax-M2

# AI SDK 6 Beta Settings
VITE_ENABLE_AI_PROVIDER=true
VITE_DEFAULT_USE_CASE=general
VITE_ENABLE_TOOL_APPROVAL=false
VITE_ENABLE_STRUCTURED_OUTPUT=true
VITE_MAX_TOOL_STEPS=5

# Application Settings
VITE_MAX_TOKENS=2048
VITE_TEMPERATURE=0.7
VITE_THEME=auto
VITE_LANGUAGE=en
```

### API Configuration

The application supports multiple API formats with AI SDK 6 Beta:

```javascript
// AI SDK 6 Beta Provider (Recommended)
import { createMiniMax } from '@ai-sdk/minimax'
import { streamText } from 'ai'

const minimax = createMiniMax({
  baseURL: process.env.VITE_MINIMAX_BASE_URL,
  apiKey: process.env.VITE_MINIMAX_API_KEY
})

// Stream text with tools
const result = await streamText({
  model: minimax('MiniMax-M2'),
  messages,
  tools: {
    weather: tool({
      description: 'Get weather info',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temp: 22 })
    })
  }
})
```

### Agent Configuration

```javascript
// Create specialized agents for different use cases
const weatherAgent = agent({
  model: minimax('MiniMax-M2'),
  instructions: 'You are a helpful weather assistant',
  tools: { weather: weatherTool },
  stopWhen: stepCountIs(3)
})

const calculatorAgent = agent({
  model: minimax('MiniMax-M2'),
  instructions: 'You are a mathematical calculator',
  tools: { calculate: mathTool },
  stopWhen: stepCountIs(2)
})
```

## 🏗 Project Structure

```
chat-ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatMessage.vue      # Individual message display
│   │   ├── MessageInput.vue     # Message input with file upload
│   │   ├── ModelSelector.vue    # AI model selection
│   │   ├── SettingsPanel.vue    # Settings interface
│   │   ├── ToastContainer.vue   # Notification system
│   │   └── Icon.vue             # Icon component
│   ├── pages/               # Route components
│   │   ├── ChatPage.vue         # Main chat interface
│   │   ├── SettingsPage.vue     # Settings page
│   │   ├── HelpPage.vue         # Help and documentation
│   │   └── NotFoundPage.vue     # 404 error page
│   ├── stores/              # Pinia state management
│   │   ├── chatStore.js         # Chat state management
│   │   └── settingsStore.js     # Settings state management
│   ├── services/            # API and business logic
│   │   ├── minimaxService.js    # MiniMax API with AI SDK 6 Beta
│   │   └── fileService.js       # File handling service
│   ├── utils/               # Helper functions
│   │   ├── dateUtils.js         # Date formatting utilities
│   │   ├── numberUtils.js       # Number formatting utilities
│   │   └── exportUtils.js       # Export/import utilities
│   ├── App.vue              # Main application component
│   ├── main.js              # Application entry point
│   ├── router.js            # Vue Router configuration
│   └── style.css            # Global styles and CSS variables
├── public/                  # Static assets
├── package.json
├── vite.config.js          # Vite configuration
├── .env.example            # Environment variable template
└── README.md
```

## 🔧 AI SDK 6 Beta Integration

### Agent Interface
```javascript
import { agent, streamText, tool, stepCountIs } from 'ai'
import { createMiniMax } from '@ai-sdk/minimax'

// Create MiniMax provider
const minimax = createMiniMax({
  baseURL: 'https://api.minimax.chat',
  apiKey: 'your-api-key'
})

// Create agent with tools
const weatherAgent = agent({
  model: minimax('MiniMax-M2'),
  tools: {
    weather: tool({
      description: 'Get weather information',
      inputSchema: z.object({
        location: z.string()
      }),
      execute: async ({ location }) => {
        // Return weather data
        return { location, temperature: 22, condition: 'sunny' }
      }
    })
  },
  stopWhen: stepCountIs(5)
})

// Use in conversation
const result = await weatherAgent.stream('What\'s the weather in Paris?')
```

### Structured Output
```javascript
import { generateText, createDataStreamResponse } from 'ai'

// Generate structured data
const result = await generateText({
  model: minimax('MiniMax-M2'),
  messages: [{ role: 'user', content: 'Extract contact info' }],
  output: {
    schema: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().optional()
    })
  }
})

// Access structured output
console.log(result.output) // { name: 'John', email: 'john@example.com' }
```

## 🎨 Customization

### Themes

The application includes built-in dark and light themes:

```css
/* Dark theme */
:root[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent: #6366f1;
}

/* Light theme */
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent: #6366f1;
}
```

### Custom Tools

Extend the chatbot capabilities by adding custom tools:

```javascript
// tools/calculator.js
export const calculator = {
  name: 'calculator',
  description: 'Perform basic mathematical calculations',
  parameters: {
    expression: {
      type: 'string',
      description: 'Mathematical expression to evaluate'
    }
  },
  handler: async (params) => {
    // Implementation
    return result
  }
}
```

## 🔒 Security

- **API Key Protection**: Never expose API keys in client-side code
- **Input Sanitization**: All user inputs are sanitized before processing
- **CORS Configuration**: Proper CORS setup for API requests
- **Rate Limiting**: Client-side rate limiting to prevent abuse

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/sheikh-who/chat-ui/wiki)
- **Issues**: [GitHub Issues](https://github.com/sheikh-who/chat-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sheikh-who/chat-ui/discussions)

---

**Powered by MiniMax M2** - Advanced conversational AI for the modern web