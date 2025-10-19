/**
 * Avatar Utility Functions
 * Generates initials and colors for user avatars when no photo is available
 */

/**
 * Get initials from a full name
 * @param {string} fullName - The user's full name
 * @returns {string} - Initials (max 2 characters)
 */
export const getInitials = (fullName) => {
  if (!fullName || typeof fullName !== 'string') return '?';
  
  const trimmedName = fullName.trim();
  if (!trimmedName) return '?';
  
  const names = trimmedName.split(' ').filter(name => name.length > 0);
  
  if (names.length === 0) return '?';
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  // First and last name initials
  return (
    names[0].charAt(0).toUpperCase() + 
    names[names.length - 1].charAt(0).toUpperCase()
  );
};

/**
 * Generate a consistent color based on a string (name or ID)
 * @param {string} str - The string to generate color from
 * @returns {string} - HSL color string
 */
export const stringToColor = (str) => {
  if (!str || typeof str !== 'string') {
    // Default color for empty/invalid strings
    return 'hsl(200, 65%, 50%)'; // Blue
  }
  
  // Generate hash from string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate hue (0-360) from hash
  const hue = Math.abs(hash % 360);
  
  // Use consistent saturation and lightness for professional look
  return `hsl(${hue}, 65%, 50%)`;
};

/**
 * Get avatar background color from full name
 * @param {string} fullName - The user's full name
 * @returns {string} - HSL color string
 */
export const getAvatarColor = (fullName) => {
  return stringToColor(fullName || 'default');
};

/**
 * Generate avatar style object
 * @param {string} fullName - The user's full name
 * @param {number} size - Size in pixels (optional, for inline sizing)
 * @returns {object} - Style object with background color
 */
export const getAvatarStyle = (fullName, size = null) => {
  const style = {
    backgroundColor: getAvatarColor(fullName),
  };
  
  if (size) {
    style.width = `${size}px`;
    style.height = `${size}px`;
    style.fontSize = `${size * 0.4}px`; // 40% of size for text
  }
  
  return style;
};

