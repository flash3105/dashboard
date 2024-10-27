// cache.js
const fs = require('fs');
const path = require('path');

const cacheFilePath = path.join(__dirname, 'cache.json');

const cacheData = (key, data) => {
    const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8') || '{}');
    cache[key] = data;
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
};

const getCachedData = (key) => {
    if (fs.existsSync(cacheFilePath)) {
        const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
        return cache[key] || null;
    }
    return null;
};

module.exports = { cacheData, getCachedData };
