import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

/**
 * Format a date for display in chat messages
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    if (isToday(dateObj)) {
      return format(dateObj, 'HH:mm')
    } else if (isYesterday(dateObj)) {
      return 'Yesterday'
    } else {
      return format(dateObj, 'MMM d')
    }
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Format a date with full timestamp
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    if (isToday(dateObj)) {
      return format(dateObj, "'Today at' HH:mm")
    } else if (isYesterday(dateObj)) {
      return format(dateObj, "'Yesterday at' HH:mm")
    } else {
      return format(dateObj, 'MMM d, yyyy HH:mm')
    }
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Format a date in relative terms
 * @param {Date|string} date - The date to format
 * @returns {string} Relative date string
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return ''
  }
}

/**
 * Format duration in human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

/**
 * Get the current timestamp in ISO format
 * @returns {string} ISO timestamp
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString()
}

/**
 * Parse various date formats to Date object
 * @param {string|Date} date - Date to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (date) => {
  if (!date) return null
  
  try {
    if (date instanceof Date) {
      return date
    }
    
    // Try different parsing methods
    const parsed = parseISO(date)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
    
    // Fallback to Date constructor
    const fallback = new Date(date)
    if (!isNaN(fallback.getTime())) {
      return fallback
    }
    
    return null
  } catch (error) {
    console.error('Error parsing date:', error)
    return null
  }
}

/**
 * Check if a date is valid
 * @param {string|Date} date - Date to validate
 * @returns {boolean} True if valid
 */
export const isValidDate = (date) => {
  return parseDate(date) !== null
}

/**
 * Get timezone information
 * @returns {string} Timezone string
 */
export const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    console.error('Error getting timezone:', error)
    return 'UTC'
  }
}

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForInput = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = parseDate(date)
    if (!dateObj) return ''
    
    return format(dateObj, 'yyyy-MM-dd')
  } catch (error) {
    console.error('Error formatting date for input:', error)
    return ''
  }
}

/**
 * Format time for input fields (HH:mm)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTimeForInput = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = parseDate(date)
    if (!dateObj) return ''
    
    return format(dateObj, 'HH:mm')
  } catch (error) {
    console.error('Error formatting time for input:', error)
    return ''
  }
}

/**
 * Convert date to timestamp
 * @param {Date|string} date - Date to convert
 * @returns {number} Unix timestamp
 */
export const toTimestamp = (date) => {
  try {
    const dateObj = parseDate(date)
    return dateObj ? Math.floor(dateObj.getTime() / 1000) : 0
  } catch (error) {
    console.error('Error converting to timestamp:', error)
    return 0
  }
}

/**
 * Convert timestamp to Date
 * @param {number} timestamp - Unix timestamp
 * @returns {Date} Date object
 */
export const fromTimestamp = (timestamp) => {
  try {
    return new Date(timestamp * 1000)
  } catch (error) {
    console.error('Error converting from timestamp:', error)
    return new Date()
  }
}