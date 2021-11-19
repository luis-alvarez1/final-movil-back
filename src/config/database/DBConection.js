const mongoose = require('mongoose');
const EnvModule = require('../../config/env/envModule');

EnvModule.configEnv();
let instance = null;
class DBConnection {
  constructor() {
    this._conn = null;
  }

  async connect() {
    if (instance) {
      try {
        this._conn = await mongoose.connect(
          process.env.DB_MONGO,
          {
            useNewUrlParser: true,
          },
        );
        console.log('DB Connected');
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    }
  }

  get conn() {
    return this._conn;
  }

  static getInstance() {
    if (!instance) {
      instance = new DBConnection();
    }

    return instance;
  }
}

module.exports = { DBConnection }