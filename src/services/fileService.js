/**
 * File upload and management service
 */

export const uploadFile = async (files) => {
  if (!files || files.length === 0) {
    throw new Error('No files provided')
  }
  
  const results = []
  
  for (const file of files) {
    try {
      const result = await processFile(file)
      results.push(result)
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error)
      results.push({
        name: file.name,
        success: false,
        error: error.message
      })
    }
  }
  
  return results
}

const processFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        content: reader.result,
        success: true
      })
    }
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`))
    }
    
    // Determine reader type based on file
    if (isTextFile(file)) {
      reader.readAsText(file)
    } else if (isImageFile(file)) {
      reader.readAsDataURL(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  })
}

const isTextFile = (file) => {
  const textTypes = [
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/json'
  ]
  
  // Check by extension as fallback
  const textExtensions = ['.txt', '.md', '.json', '.csv', '.html', '.css', '.js', '.ts', '.jsx', '.tsx']
  const hasTextExtension = textExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  
  return textTypes.includes(file.type) || hasTextExtension
}

const isImageFile = (file) => {
  return file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(file.name)
}

/**
 * Download file as blob
 * @param {Blob|string} content - File content
 * @param {string} filename - Download filename
 * @param {string} mimeType - MIME type
 */
export const downloadFile = (content, filename, mimeType = 'application/octet-stream') => {
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
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Read file as JSON
 * @param {File} file - File to read
 * @returns {Promise<Object>} Parsed JSON
 */
export const readFileAsJSON = (file) => {
  return readFileAsText(file).then(JSON.parse)
}

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = [],
    allowedExtensions = []
  } = options
  
  const errors = []
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${formatFileSize(maxSize)} limit`)
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed`)
  }
  
  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} not allowed`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Create file URL for display
 * @param {File} file - File to create URL for
 * @returns {string} Object URL
 */
export const createFileURL = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Revoke file URL to free memory
 * @param {string} url - URL to revoke
 */
export const revokeFileURL = (url) => {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Check if file is too large for processing
 * @param {File} file - File to check
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} True if file is too large
 */
export const isFileTooLarge = (file, maxSize = 5 * 1024 * 1024) => {
  return file.size > maxSize
}