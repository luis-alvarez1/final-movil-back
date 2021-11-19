const { DBConnection } = require('./DBConection');

const connectDB = async () => {
  const dbConnection = DBConnection.getInstance();

  dbConnection.connect();
};

module.exports = { connectDB }