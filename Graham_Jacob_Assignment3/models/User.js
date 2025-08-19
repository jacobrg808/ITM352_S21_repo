const { hashPassword, comparePassword } = require('../utils/auth');
const Database = require('../config/database');

class User {
    constructor() {
        this.db = new Database();
        this.users = this.db.read();
    }

    /**
     * Save users to database
     */
    saveUsers() {
        const success = this.db.write(this.users);
        if (!success) {
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