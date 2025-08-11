const express = require('express');
const { body, validationResult } = require('express-validator');
const queryString = require('query-string');
const User = require('../models/User');
const { isValidEmail, isValidUsername, isValidName, sanitizeString } = require('../utils/validation');

const router = express.Router();
const userModel = new User();

const loginValidation = [
    body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
    body('password').isLength({ min: 1 }).withMessage('Password is required')
];
const registrationValidation = [
    body('name').trim().isLength({ min: 1, max: 30 }).withMessage('Name must be 1-30 characters')
        .custom(value => {
            if (!isValidName(value)) {
                throw new Error('Name can only contain letters and spaces');
            }
            return true;
        }),
    body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters')
        .custom(value => {
            if (!isValidUsername(value)) {
                throw new Error('Username can only contain letters and numbers');
            }
            return true;
        }),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('repeat_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];
router.post('/process_login', loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            req.query.errors = errorMessages.join(';');
            return res.redirect('./login.html?' + queryString.stringify(req.query));
        }

        const { username, password } = req.body;
        const user = await userModel.authenticateUser(username, password);

        if (user) {
            req.session.authenticated = true;
            req.session.username = user.username;
            req.query.username = user.username;
            req.query.name = user.name;
            res.cookie('username', user.username, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.redirect('./index.html?' + queryString.stringify(req.query));
        } else {
            req.query.errors = 'Invalid username or password';
            res.redirect('./login.html?' + queryString.stringify(req.query));
        }
    } catch (error) {
        console.error('Login error:', error);
        req.query.errors = 'An error occurred during login';
        res.redirect('./login.html?' + queryString.stringify(req.query));
    }
});


router.post('/process_register', registrationValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        const customErrors = [];

        // Check username availability
        if (userModel.userExists(req.body.username)) {
            customErrors.push('Username is already taken');
        }

        const allErrors = [...errors.array().map(error => error.msg), ...customErrors];

        if (allErrors.length > 0) {
            req.query.errors = allErrors.join(';');
            return res.redirect('./register.html?' + queryString.stringify(req.query));
        }

        const userData = {
            username: sanitizeString(req.body.username),
            name: sanitizeString(req.body.name),
            email: sanitizeString(req.body.email),
            password: req.body.password
        };

        const success = await userModel.createUser(userData);

        if (success) {
            req.session.authenticated = true;
            req.session.username = userData.username.toLowerCase();
            res.cookie('username', userData.username.toLowerCase(), { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production' 
            });
            res.cookie('name', userData.name, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production' 
            });
            res.redirect('./index.html');
        } else {
            req.query.errors = 'Registration failed. Please try again.';
            res.redirect('./register.html?' + queryString.stringify(req.query));
        }
    } catch (error) {
        console.error('Registration error:', error);
        req.query.errors = 'An error occurred during registration';
        res.redirect('./register.html?' + queryString.stringify(req.query));
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        res.clearCookie('username');
        res.clearCookie('name');
        res.clearCookie('email');
        res.send(`<script>alert('Successfully logged out!'); location.href="./index.html";</script>`);
    });
});

module.exports = router;