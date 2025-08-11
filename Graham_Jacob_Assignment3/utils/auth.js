const bcrypt = require('bcrypt');

/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a password with its hash
 */
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

/**
 * Middleware to check if user is authenticated
 */
function requireAuth(req, res, next) {
    if (req.cookies.username && req.session.authenticated) {
        next();
    } else {
        res.redirect('/login.html?error=Please log in to continue');
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    requireAuth
};