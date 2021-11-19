const dotenv = require('dotenv');

const configEnv = () => dotenv.config({ path: '.env' });

module.exports = { configEnv }