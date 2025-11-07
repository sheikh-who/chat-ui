<template>
  <div class="help-page">
    <div class="container">
      <h1 class="page-title">Help & Support</h1>
      
      <div class="help-content">
        <!-- Quick Start -->
        <section class="help-section">
          <h2>Quick Start</h2>
          <div class="step-cards">
            <div class="step-card">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Get Your API Key</h3>
                <p>Sign up at <a href="https://platform.minimax.chat" target="_blank">MiniMax Platform</a> and get your API key from the dashboard.</p>
              </div>
            </div>
            <div class="step-card">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Configure API Settings</h3>
                <p>Go to Settings → API Configuration and enter your API key and base URL.</p>
              </div>
            </div>
            <div class="step-card">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Start Chatting</h3>
                <p>Test your connection and start chatting with MiniMax M2 AI models.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="help-section">
          <h2>Features</h2>
          <div class="features-grid">
            <div class="feature-card">
              <Icon name="message-circle" class="feature-icon" />
              <h3>Conversational AI</h3>
              <p>Chat with MiniMax M2 models using natural language</p>
            </div>
            <div class="feature-card">
              <Icon name="zap" class="feature-icon" />
              <h3>Real-time Streaming</h3>
              <p>See AI responses as they're generated in real-time</p>
            </div>
            <div class="feature-card">
              <Icon name="tool" class="feature-icon" />
              <h3>Tool Calling</h3>
              <p>AI can use external tools and APIs to help answer questions</p>
            </div>
            <div class="feature-card">
              <Icon name="brain" class="feature-icon" />
              <h3>AI SDK 6 Beta</h3>
              <p>Enhanced capabilities with structured output and agent interface</p>
            </div>
            <div class="feature-card">
              <Icon name="upload" class="feature-icon" />
              <h3>File Support</h3>
              <p>Upload and discuss documents, images, and other files</p>
            </div>
            <div class="feature-card">
              <Icon name="download" class="feature-icon" />
              <h3>Export & Import</h3>
              <p>Backup and restore your conversations and settings</p>
            </div>
          </div>
        </section>

        <!-- API Configuration -->
        <section class="help-section">
          <h2>API Configuration</h2>
          <div class="config-details">
            <h3>Required Settings</h3>
            <ul>
              <li><strong>API Key:</strong> Your MiniMax API key from the platform dashboard</li>
              <li><strong>Base URL:</strong> Usually <code>https://api.minimax.chat</code></li>
              <li><strong>Model:</strong> Choose between MiniMax-M2 or MiniMax-M2-Stable</li>
            </ul>
            
            <h3>Testing Your Connection</h3>
            <p>After entering your API credentials, use the "Test Connection" button to verify everything is working correctly.</p>
            
            <h3>Rate Limits</h3>
            <p>MiniMax M2 models have generous rate limits. Check your <a href="https://platform.minimax.chat/dashboard" target="_blank">dashboard</a> for current usage statistics.</p>
          </div>
        </section>

        <!-- AI SDK 6 Beta -->
        <section class="help-section">
          <h2>AI SDK 6 Beta Features</h2>
          <div class="sdk-features">
            <div class="sdk-feature">
              <h3>Tool Calling</h3>
              <p>Enable AI to use external tools like weather APIs, calculators, or search engines to provide more accurate responses.</p>
              <ul>
                <li><strong>Weather Assistant:</strong> Get real-time weather information</li>
                <li><strong>Calculator:</strong> Perform mathematical calculations</li>
                <li><strong>Search Assistant:</strong> Find information from the web</li>
                <li><strong>Multi-Tool:</strong> Combine multiple tools for complex tasks</li>
              </ul>
            </div>
            
            <div class="sdk-feature">
              <h3>Tool Execution Approval</h3>
              <p>For sensitive operations, enable approval requests so the AI asks for your permission before executing tools.</p>
            </div>
            
            <div class="sdk-feature">
              <h3>Structured Output</h3>
              <p>Generate structured data (JSON, arrays, etc.) alongside text responses for better integration with other systems.</p>
            </div>
            
            <div class="sdk-feature">
              <h3>Multi-Step Conversations</h3>
              <p>AI can make multiple tool calls and iterations to provide more comprehensive answers to complex questions.</p>
            </div>
          </div>
        </section>

        <!-- Troubleshooting -->
        <section class="help-section">
          <h2>Troubleshooting</h2>
          <div class="troubleshooting">
            <div class="issue">
              <h3>Connection Failed</h3>
              <p><strong>Problem:</strong> Test connection returns an error</p>
              <p><strong>Solutions:</strong></p>
              <ul>
                <li>Check your API key is correct and active</li>
                <li>Verify the base URL is accessible</li>
                <li>Ensure you have internet connection</li>
                <li>Check if your API key has the required permissions</li>
              </ul>
            </div>
            
            <div class="issue">
              <h3>Messages Not Sending</h3>
              <p><strong>Problem:</strong> Chat messages fail to send</p>
              <p><strong>Solutions:</strong></p>
              <ul>
                <li>Verify API configuration is saved</li>
                <li>Check your API quota and rate limits</li>
                <li>Ensure your messages are within token limits</li>
                <li>Try refreshing the page and reconfiguring</li>
              </ul>
            </div>
            
            <div class="issue">
              <h3>Tool Calling Not Working</h3>
              <p><strong>Problem:</strong> AI doesn't use tools even when appropriate</p>
              <p><strong>Solutions:</strong></p>
              <ul>
                <li>Enable AI SDK 6 Beta features in settings</li>
                <li>Check if tools are enabled for your use case</li>
                <li>Try asking more specific questions that require tools</li>
                <li>Verify the model supports tool calling</li>
              </ul>
            </div>
            
            <div class="issue">
              <h3>UI/Display Issues</h3>
              <p><strong>Problem:</strong> Interface looks broken or not working properly</p>
              <p><strong>Solutions:</strong></p>
              <ul>
                <li>Try a different browser or clear browser cache</li>
                <li>Disable browser extensions that might interfere</li>
                <li>Check if JavaScript is enabled</li>
                <li>Try refreshing the page</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Keyboard Shortcuts -->
        <section class="help-section">
          <h2>Keyboard Shortcuts</h2>
          <div class="shortcuts">
            <div class="shortcut">
              <kbd>Enter</kbd>
              <span>Send message (when input is focused)</span>
            </div>
            <div class="shortcut">
              <kbd>Shift</kbd> + <kbd>Enter</kbd>
              <span>New line in message</span>
            </div>
            <div class="shortcut">
              <kbd>Ctrl</kbd> + <kbd>K</kbd>
              <span>Focus message input</span>
            </div>
            <div class="shortcut">
              <kbd>Ctrl</kbd> + <kbd>E</kbd>
              <span>Export conversations</span>
            </div>
            <div class="shortcut">
              <kbd>Ctrl</kbd> + <kbd>/</kbd>
              <span>Show keyboard shortcuts</span>
            </div>
          </div>
        </section>

        <!-- Support -->
        <section class="help-section">
          <h2>Support & Resources</h2>
          <div class="support-links">
            <div class="support-link">
              <Icon name="book" class="support-icon" />
              <div>
                <h3>Documentation</h3>
                <p>Visit our <a href="https://github.com/sheikh-who/chat-ui" target="_blank">GitHub repository</a> for detailed documentation and examples.</p>
              </div>
            </div>
            
            <div class="support-link">
              <Icon name="github" class="support-icon" />
              <div>
                <h3>Report Issues</h3>
                <p>Found a bug? <a href="https://github.com/sheikh-who/chat-ui/issues" target="_blank">Open an issue</a> on GitHub to help us improve.</p>
              </div>
            </div>
            
            <div class="support-link">
              <Icon name="heart" class="support-icon" />
              <div>
                <h3>Community</h3>
                <p>Join the community discussions and share your experiences with other users.</p>
              </div>
            </div>
            
            <div class="support-link">
              <Icon name="mail" class="support-icon" />
              <div>
                <h3>Contact</h3>
                <p>Need direct support? Contact us through the <a href="https://github.com/sheikh-who/chat-ui" target="_blank">GitHub repository</a>.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Icon from '@/components/Icon.vue'

// Set page title
onMounted(() => {
  document.title = 'Help & Support - Chat-UI'
})
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 3rem;
  text-align: center;
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.help-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.help-section h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

/* Quick Start */
.step-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.step-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.step-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.step-content a {
  color: var(--primary-color);
  text-decoration: none;
}

.step-content a:hover {
  text-decoration: underline;
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-card {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Configuration Details */
.config-details h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.5rem 0 0.75rem 0;
}

.config-details h3:first-child {
  margin-top: 0;
}

.config-details ul {
  list-style: none;
  padding: 0;
}

.config-details li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.config-details li strong {
  color: var(--text-primary);
  font-weight: 600;
}

.config-details code {
  background: var(--bg-tertiary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--primary-color);
}

.config-details a {
  color: var(--primary-color);
  text-decoration: none;
}

.config-details a:hover {
  text-decoration: underline;
}

/* SDK Features */
.sdk-features {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
}

.sdk-feature {
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.sdk-feature h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.sdk-feature p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.sdk-feature ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0;
}

.sdk-feature li {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.sdk-feature li strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* Troubleshooting */
.troubleshooting {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.issue {
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border-left: 4px solid var(--warning-color);
}

.issue h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.issue p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.issue p strong {
  color: var(--text-primary);
  font-weight: 600;
}

.issue ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0;
}

.issue li {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

/* Keyboard Shortcuts */
.shortcuts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
}

kbd {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.shortcut span {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Support Links */
.support-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.support-link {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.support-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.support-icon {
  width: 2rem;
  height: 2rem;
  color: var(--primary-color);
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.support-link h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.support-link p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.support-link a {
  color: var(--primary-color);
  text-decoration: none;
}

.support-link a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .help-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .step-cards,
  .features-grid,
  .support-links {
    grid-template-columns: 1fr;
  }
  
  .shortcuts {
    grid-template-columns: 1fr;
  }
  
  .shortcut {
    flex-direction: column;
    text-align: center;
  }
}
</style>