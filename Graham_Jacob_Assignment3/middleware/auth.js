// Authentication middleware
const { requireAuth } = require('../utils/auth');

/**
 * Middleware to check if user is authenticated
 */
function authenticateUser(req, res, next) {
    return requireAuth(req, res, next);
}

/**
 * Middleware to check if user is already logged in (for login/register pages)
 */
function redirectIfAuthenticated(req, res, next) {
    if (req.cookies.username && req.session.authenticated) {
        return res.redirect('./index.html');
    }
    next();
}

module.exports = {
    authenticateUser,
    redirectIfAuthenticated
};