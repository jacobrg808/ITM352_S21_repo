// Migrate existing plain text passwords to hashed passwords
require('dotenv').config();
const fs = require('fs');
const bcrypt = require('bcrypt');

async function migratePasswords() {
    try {
        const userDataFile = './user_data.json';
        
        if (!fs.existsSync(userDataFile)) {
            console.log('user_data.json not found, skipping migration');
            return;
        }

        const users = JSON.parse(fs.readFileSync(userDataFile, 'utf-8'));
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

        fs.writeFileSync(`${userDataFile}.backup`, JSON.stringify(users, null, 2));
        fs.writeFileSync(userDataFile, JSON.stringify(users, null, 2));
        
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