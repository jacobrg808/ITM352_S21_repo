// Database configuration and connection management
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dataFile = path.join(__dirname, '..', 'user_data.json');
    }

    /**
     * Read data from JSON file
     */
    read() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const data = fs.readFileSync(this.dataFile, 'utf-8');
                return JSON.parse(data);
            }
            return {};
        } catch (error) {
            console.error('Error reading data:', error);
            return {};
        }
    }

    /**
     * Write data to JSON file
     */
    write(data) {
        try {
            fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing data:', error);
            return false;
        }
    }

    /**
     * Backup data file
     */
    backup() {
        try {
            const data = this.read();
            const backupFile = `${this.dataFile}.backup.${Date.now()}`;
            fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
            return backupFile;
        } catch (error) {
            console.error('Error creating backup:', error);
            return null;
        }
    }
}

module.exports = Database;