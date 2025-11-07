# Chat-UI: Conversational AI Interface

A modern, responsive chatbot interface powered by **MiniMax M2** with advanced conversational capabilities and tool integration.

## 🚀 Features

- **Modern UI**: Clean, responsive design with dark/light mode
- **MiniMax M2 Integration**: Powered by advanced text generation models
- **Real-time Chat**: Streaming responses with typing indicators
- **Tool Integration**: Support for function calls and external tools
- **Context Awareness**: Maintains conversation history and context
- **Multi-model Support**: Switch between different MiniMax models
- **Export/Import**: Save and restore conversation history
- **Customizable**: Theme and behavior customization

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

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MiniMax API credentials

# Start development server
npm run dev
```

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
VITE_MINIMAX_API_KEY=your_api_key_here
VITE_MINIMAX_BASE_URL=https://api.minimax.chat/v1
VITE_DEFAULT_MODEL=minimax-m2
VITE_MAX_TOKENS=2048
```

### API Configuration

The application supports both Anthropic and OpenAI SDK compatibility:

```javascript
// Anthropic SDK (Recommended)
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.VITE_MINIMAX_API_KEY,
  baseURL: process.env.VITE_MINIMAX_BASE_URL
})

// OpenAI SDK
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.VITE_MINIMAX_API_KEY,
  baseURL: process.env.VITE_MINIMAX_BASE_URL
})
```

## 🏗 Project Structure

```
chat-ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatMessage.vue
│   │   ├── MessageInput.vue
│   │   ├── ModelSelector.vue
│   │   └── ThemeToggle.vue
│   ├── stores/             # Pinia state management
│   │   ├── chatStore.js
│   │   └── settingsStore.js
│   ├── services/           # API and business logic
│   │   ├── minimaxService.js
│   │   ├── chatService.js
│   │   └── storageService.js
│   ├── utils/              # Helper functions
│   │   ├── textUtils.js
│   │   └── apiUtils.js
│   ├── App.vue             # Main application component
│   └── main.js             # Application entry point
├── public/                 # Static assets
├── package.json
└── README.md
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