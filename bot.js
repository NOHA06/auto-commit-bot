const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'activity.log');
const timestamp = new Date().toISOString();
fs.appendFile(filePath, `[Auto] Pulse at ${timestamp}\n`, (err) => {
    if (err) throw err;
    console.log('Fait !');
});
