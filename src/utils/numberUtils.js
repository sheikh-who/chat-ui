/**
 * Format large numbers with appropriate suffixes
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  
  const absNum = Math.abs(num)
  
  if (absNum < 1000) {
    return num.toString()
  } else if (absNum < 1000000) {
    return (num / 1000).toFixed(decimals) + 'K'
  } else if (absNum < 1000000000) {
    return (num / 1000000).toFixed(decimals) + 'M'
  } else if (absNum < 1000000000000) {
    return (num / 1000000000).toFixed(decimals) + 'B'
  } else {
    return (num / 1000000000000).toFixed(decimals) + 'T'
  }
}

/**
 * Format numbers with locale-specific formatting
 * @param {number} num - Number to format
 * @param {string} locale - Locale code
 * @returns {string} Formatted number string
 */
export const formatNumberWithLocale = (num, locale = 'en-US') => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Format file sizes in human readable format
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, total, decimals = 1) => {
  if (total === 0) return '0%'
  
  const percentage = (value / total) * 100
  return percentage.toFixed(decimals) + '%'
}

/**
 * Round number to specified decimals
 * @param {number} num - Number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded number
 */
export const roundToDecimals = (num, decimals = 2) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Clamp a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max)
}

/**
 * Generate a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {boolean} inclusive - Whether to include max value
 * @returns {number} Random number
 */
export const randomBetween = (min, max, inclusive = true) => {
  const range = inclusive ? (max - min + 1) : (max - min)
  return Math.floor(Math.random() * range) + min
}

/**
 * Calculate the average of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average value
 */
export const average = (numbers) => {
  if (!numbers || numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

/**
 * Calculate the sum of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Sum of numbers
 */
export const sum = (numbers) => {
  if (!numbers || numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0)
}

/**
 * Calculate the median of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Median value
 */
export const median = (numbers) => {
  if (!numbers || numbers.length === 0) return 0
  
  const sorted = [...numbers].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  } else {
    return sorted[middle]
  }
}

/**
 * Format large currency amounts
 * @param {number} amount - Currency amount
 * @param {string} currency - Currency code
 * @param {string} locale - Locale code
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Format large token counts
 * @param {number} tokens - Number of tokens
 * @returns {string} Formatted token count
 */
export const formatTokens = (tokens) => {
  if (tokens === null || tokens === undefined || isNaN(tokens)) return '0'
  
  if (tokens < 1000) {
    return tokens.toString()
  } else if (tokens < 1000000) {
    return (tokens / 1000).toFixed(1) + 'K'
  } else if (tokens < 1000000000) {
    return (tokens / 1000000).toFixed(1) + 'M'
  } else {
    return (tokens / 1000000000).toFixed(1) + 'B'
  }
}

/**
 * Convert bytes to human readable string
 * @param {number} bytes - Size in bytes
 * @param {string} unit - Unit to use (auto, KB, MB, GB, etc.)
 * @returns {string} Formatted size
 */
export const bytesToString = (bytes, unit = 'auto') => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  let i = 0
  if (unit !== 'auto') {
    i = sizes.indexOf(unit.toUpperCase())
    if (i === -1) {
      i = Math.floor(Math.log(bytes) / Math.log(k))
    }
  } else {
    i = Math.floor(Math.log(bytes) / Math.log(k))
  }
  
  const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(2))
  return formatted + ' ' + sizes[i]
}

/**
 * Convert string representation back to bytes
 * @param {string} str - String representation
 * @returns {number} Size in bytes
 */
export const stringToBytes = (str) => {
  if (!str) return 0
  
  const match = str.toUpperCase().match(/^(\d*\.?\d+)\s*([KMGTPZY]?B)?$/)
  if (!match) return 0
  
  const value = parseFloat(match[1])
  const unit = match[2] || 'B'
  
  const unitMap = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 ** 2,
    'GB': 1024 ** 3,
    'TB': 1024 ** 4,
    'PB': 1024 ** 5,
    'EB': 1024 ** 6,
    'ZB': 1024 ** 7,
    'YB': 1024 ** 8
  }
  
  return value * (unitMap[unit] || 1)
}

/**
 * Format numerical input for display
 * @param {number} value - Value to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted number
 */
export const formatNumericInput = (value, options = {}) => {
  const {
    prefix = '',
    suffix = '',
    decimals = 2,
    thousands = true
  } = options
  
  if (value === null || value === undefined || isNaN(value)) {
    return `${prefix}0${suffix}`
  }
  
  let formatted = value.toString()
  
  if (thousands && Math.abs(value) >= 1000) {
    formatted = new Intl.NumberFormat('en-US').format(value)
  } else if (decimals > 0) {
    formatted = value.toFixed(decimals)
  }
  
  return `${prefix}${formatted}${suffix}`
}

/**
 * Validate if a value is a valid number
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid number
 */
export const isValidNumber = (value) => {
  return value !== null && value !== undefined && !isNaN(value) && isFinite(value)
}

/**
 * Convert between number bases
 * @param {number} number - Number to convert
 * @param {number} fromBase - Source base
 * @param {number} toBase - Target base
 * @returns {string} Converted number
 */
export const convertBase = (number, fromBase = 10, toBase = 10) => {
  try {
    const num = parseInt(number.toString(), fromBase)
    return num.toString(toBase).toUpperCase()
  } catch (error) {
    console.error('Error converting base:', error)
    return '0'
  }
}