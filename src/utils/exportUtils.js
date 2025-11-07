/**
 * Export conversation to various formats
 * @param {Object} conversation - The conversation to export
 * @param {string} format - Export format ('json', 'txt', 'markdown')
 * @returns {string} Exported data as string
 */
export const exportConversation = (conversation, format = 'json') => {
  const exportData = {
    id: conversation.id,
    title: conversation.title,
    model: conversation.model,
    settings: conversation.settings,
    messages: conversation.messages,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  }
  
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.stringify(exportData, null, 2)
      
    case 'txt':
      return formatAsText(exportData)
      
    case 'markdown':
      return formatAsMarkdown(exportData)
      
    default:
      return JSON.stringify(exportData, null, 2)
  }
}

/**
 * Format conversation as plain text
 * @param {Object} conversation - The conversation data
 * @returns {string} Formatted text
 */
const formatAsText = (conversation) => {
  let text = `Conversation: ${conversation.title}\n`
  text += `Model: ${conversation.model}\n`
  text += `Created: ${conversation.createdAt}\n`
  text += `Exported: ${conversation.exportedAt}\n`
  text += '\n' + '='.repeat(50) + '\n\n'
  
  conversation.messages.forEach(message => {
    const role = message.role === 'user' ? 'User' : 'Assistant'
    const timestamp = new Date(message.timestamp).toISOString()
    text += `[${role}] ${timestamp}\n${message.content}\n\n`
  })
  
  return text
}

/**
 * Format conversation as Markdown
 * @param {Object} conversation - The conversation data
 * @returns {string} Formatted markdown
 */
const formatAsMarkdown = (conversation) => {
  let markdown = `# ${conversation.title}\n\n`
  markdown += `**Model:** ${conversation.model}\n`
  markdown += `**Created:** ${conversation.createdAt}\n`
  markdown += `**Exported:** ${conversation.exportedAt}\n\n`
  markdown += '---\n\n'
  
  conversation.messages.forEach(message => {
    const role = message.role === 'user' ? '👤 **User**' : '🤖 **Assistant**'
    const timestamp = new Date(message.timestamp).toLocaleString()
    markdown += `## ${role}\n\n`
    markdown += `*${timestamp}*\n\n`
    markdown += `${formatContentAsMarkdown(message.content)}\n\n`
    markdown += '---\n\n'
  })
  
  return markdown
}

/**
 * Format message content as markdown
 * @param {string} content - The message content
 * @returns {string} Formatted markdown content
 */
const formatContentAsMarkdown = (content) => {
  // Basic markdown formatting for code blocks and lists
  let formatted = content
  
  // Format code blocks
  formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `\`\`\`${lang || ''}\n${code.trim()}\n\`\`\``
  })
  
  // Format inline code
  formatted = formatted.replace(/`([^`]+)`/g, '`$1`')
  
  // Format headers
  formatted = formatted.replace(/^### (.*$)/gm, '### $1')
  formatted = formatted.replace(/^## (.*$)/gm, '## $1')
  formatted = formatted.replace(/^# (.*$)/gm, '# $1')
  
  // Format lists
  formatted = formatted.replace(/^\* (.+)$/gm, '- $1')
  
  return formatted
}

/**
 * Download file to user's device
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Export all conversations
 * @param {Array} conversations - All conversations
 * @param {string} format - Export format
 * @returns {string} Exported data
 */
export const exportAllConversations = (conversations, format = 'json') => {
  const exportData = {
    conversations,
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    count: conversations.length
  }
  
  const filename = `chat-ui-conversations-${new Date().toISOString().split('T')[0]}`
  
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.stringify(exportData, null, 2)
      
    case 'zip':
      // For ZIP export, we'd need a library like JSZip
      // For now, fallback to JSON
      return JSON.stringify(exportData, null, 2)
      
    default:
      return JSON.stringify(exportData, null, 2)
  }
}

/**
 * Import conversation from data
 * @param {string} data - Imported data
 * @param {string} format - Data format
 * @returns {Object|null} Parsed conversation or null if failed
 */
export const importConversation = (data, format = 'json') => {
  try {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.parse(data)
        
      case 'txt':
        return parseTextConversation(data)
        
      case 'markdown':
        return parseMarkdownConversation(data)
        
      default:
        return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error importing conversation:', error)
    return null
  }
}

/**
 * Parse conversation from text format
 * @param {string} text - Text data
 * @returns {Object} Parsed conversation
 */
const parseTextConversation = (text) => {
  const lines = text.split('\n')
  const conversation = {
    id: Date.now().toString(),
    title: 'Imported Text Conversation',
    model: 'unknown',
    settings: { temperature: 0.7, maxTokens: 2048 },
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  let currentMessage = null
  
  for (const line of lines) {
    const userMatch = line.match(/^\[User\] (.+)$/)
    const assistantMatch = line.match(/^\[Assistant\] (.+)$/)
    
    if (userMatch) {
      if (currentMessage) {
        conversation.messages.push(currentMessage)
      }
      currentMessage = {
        id: Date.now().toString() + Math.random(),
        role: 'user',
        content: userMatch[1],
        timestamp: new Date().toISOString()
      }
    } else if (assistantMatch) {
      if (currentMessage) {
        currentMessage.content += '\n' + assistantMatch[1]
      }
    }
  }
  
  if (currentMessage) {
    conversation.messages.push(currentMessage)
  }
  
  return conversation
}

/**
 * Parse conversation from markdown format
 * @param {string} markdown - Markdown data
 * @returns {Object} Parsed conversation
 */
const parseMarkdownConversation = (markdown) => {
  const lines = markdown.split('\n')
  const conversation = {
    id: Date.now().toString(),
    title: 'Imported Markdown Conversation',
    model: 'unknown',
    settings: { temperature: 0.7, maxTokens: 2048 },
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  let currentMessage = null
  let inMessage = false
  
  for (const line of lines) {
    const userMatch = line.match(/^## 👤 \*\*User\*\*/)
    const assistantMatch = line.match(/^## 🤖 \*\*Assistant\*\*/)
    const timestampMatch = line.match(/^\*([^*]+)\*/)
    
    if (userMatch) {
      if (currentMessage) {
        conversation.messages.push(currentMessage)
      }
      currentMessage = {
        id: Date.now().toString() + Math.random(),
        role: 'user',
        content: '',
        timestamp: new Date().toISOString()
      }
      inMessage = true
    } else if (assistantMatch) {
      if (currentMessage) {
        conversation.messages.push(currentMessage)
      }
      currentMessage = {
        id: Date.now().toString() + Math.random(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      }
      inMessage = true
    } else if (timestampMatch && inMessage) {
      currentMessage.timestamp = timestampMatch[1]
    } else if (inMessage && line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
      if (currentMessage) {
        if (currentMessage.content) {
          currentMessage.content += '\n' + line
        } else {
          currentMessage.content = line
        }
      }
    }
  }
  
  if (currentMessage) {
    conversation.messages.push(currentMessage)
  }
  
  return conversation
}

/**
 * Generate export filename
 * @param {string} type - Export type ('conversation', 'all')
 * @param {string} format - File format
 * @returns {string} Generated filename
 */
export const generateExportFilename = (type, format = 'json') => {
  const timestamp = new Date().toISOString().split('T')[0]
  const extension = format.toLowerCase()
  
  if (type === 'conversation') {
    return `conversation-${timestamp}.${extension}`
  } else {
    return `chat-ui-backup-${timestamp}.${extension}`
  }
}

/**
 * Validate exported data
 * @param {Object} data - Data to validate
 * @returns {Object} Validation result
 */
export const validateExportData = (data) => {
  const errors = []
  
  if (!data) {
    errors.push('No data provided')
    return { isValid: false, errors }
  }
  
  if (data.conversations && Array.isArray(data.conversations)) {
    // Validating bulk export
    if (data.conversations.length === 0) {
      errors.push('No conversations in export data')
    }
  } else if (data.messages) {
    // Validating single conversation
    if (!Array.isArray(data.messages)) {
      errors.push('Messages must be an array')
    }
    if (data.messages.length === 0) {
      errors.push('Conversation has no messages')
    }
  } else {
    errors.push('Invalid export format')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize filename for safe file operations
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .toLowerCase()
    .slice(0, 100) // Limit length
}