// Migrate existing plain text passwords to hashed passwords
require('dotenv').config();
const bcrypt = require('bcrypt');
const Database = require('../config/database');

async function migratePasswords() {
    try {
        const db = new Database();
        const users = db.read();
        
        if (Object.keys(users).length === 0) {
            console.log('No users found, skipping migration');
            return;
        }
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;

        console.log('Migrating passwords to hashed format...');

        for (const username in users) {
            const user = users[username];
            
            // Check if password is already hashed
            if (!user.password.startsWith('$2b$')) {
                console.log(`Hashing password for user: ${username}`);
                user.password = await bcrypt.hash(user.password, saltRounds);
                user.migratedAt = new Date().toISOString();
            } else {
                console.log(`Password for user ${username} already hashed, skipping`);
            }
        }

        const backupFile = db.backup();
        if (backupFile) {
            console.log(`Backup created: ${backupFile}`);
        }
        
        db.write(users);
        
        console.log('Password migration completed successfully!');
        console.log('Original file backed up as user_data.json.backup');
        
    } catch (error) {
        console.error('Error during password migration:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    migratePasswords();
}

module.exports = migratePasswords;