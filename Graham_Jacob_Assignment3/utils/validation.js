/**
 * Check if a value is a non-negative integer
 */
function isNonNegInt(value) {
    const num = Number(value);
    return Number.isInteger(num) && num >= 0;
}



/**
 * Sanitize string input
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(email);
}

/**
 * Validate username format (letters and numbers only)
 */
function isValidUsername(username) {
    const usernameRegex = /^[0-9a-zA-Z]+$/;
    return usernameRegex.test(username);
}

/**
 * Validate name format (letters and spaces only)
 */
function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}

module.exports = {
    isNonNegInt,
    sanitizeString,
    isValidEmail,
    isValidUsername,
    isValidName
};