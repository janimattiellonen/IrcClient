/**
 * Formats a timestamp to a localized date string
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

/**
 * Validates if a nickname follows IRC standards
 * - Must start with a letter
 * - Can contain letters, numbers, and special characters: [ ] \ ` _ ^ { | }
 * - Must be between 1 and 30 characters
 */
export const isValidNickname = (nickname: string): boolean => {
  if (!nickname || nickname.length === 0 || nickname.length > 30) {
    return false;
  }

  const nicknameRegex = /^[a-zA-Z][a-zA-Z0-9[\]\\`_^{|}]*$/;
  return nicknameRegex.test(nickname);
};
