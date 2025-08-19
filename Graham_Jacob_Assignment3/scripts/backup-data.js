// Create backup of user data
const Database = require('../config/database');

function createBackup() {
    try {
        const db = new Database();
        const backupFile = db.backup();
        
        if (backupFile) {
            console.log(`Backup created successfully: ${backupFile}`);
        } else {
            console.log('Failed to create backup');
            process.exit(1);
        }
    } catch (error) {
        console.error('Backup error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    createBackup();
}

module.exports = createBackup;