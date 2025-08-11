const fs = require('fs');
const path = require('path');
const { hashPassword, comparePassword } = require('../utils/auth');

class User {
    constructor() {
        this.userDataFile = path.join(__dirname, '..', 'user_data.json');
        this.users = this.loadUsers();
    }

    /**
     * Load users from JSON file
     */
    loadUsers() {
        try {
            if (fs.existsSync(this.userDataFile)) {
                const data = fs.readFileSync(this.userDataFile, 'utf-8');
                return JSON.parse(data);
            }
            return {};
        } catch (error) {
            console.error('Error loading users:', error);
            return {};
        }
    }

    /**
     * Save users to JSON file
     */
    saveUsers() {
        try {
            fs.writeFileSync(this.userDataFile, JSON.stringify(this.users, null, 2));
        } catch (error) {
            console.error('Error saving users:', error);
            throw new Error('Failed to save user data');
        }
    }

    /**
     * Create a new user
     */
    async createUser(userData) {
        try {
            const { username, name, email, password } = userData;
            const hashedPassword = await hashPassword(password);
            
            this.users[username.toLowerCase()] = {
                name,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };
            
            this.saveUsers();
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            return false;
        }
    }

    /**
     * Authenticate user
     */
    async authenticateUser(username, password) {
        try {
            const user = this.users[username.toLowerCase()];
            if (!user) return null;

            const isValid = await comparePassword(password, user.password);
            if (isValid) {
                return {
                    username: username.toLowerCase(),
                    name: user.name,
                    email: user.email
                };
            }
            return null;
        } catch (error) {
            console.error('Error authenticating user:', error);
            return null;
        }
    }

    /**
     * Check if user exists
     */
    userExists(username) {
        return this.users.hasOwnProperty(username.toLowerCase());
    }

    /**
     * Get user by username
     */
    getUser(username) {
        const user = this.users[username.toLowerCase()];
        if (user) {
            return {
                username: username.toLowerCase(),
                name: user.name,
                email: user.email
            };
        }
        return null;
    }
}

module.exports = User;