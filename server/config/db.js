const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gujjar_samaj';
  const srvUri = process.env.MONGODB_URI_SRV;
  const urisToTry = srvUri && !uri.startsWith('mongodb+srv') ? [uri, srvUri] : [uri];

  for (const connectUri of urisToTry) {
    try {
      const conn = await mongoose.connect(connectUri, { serverSelectionTimeoutMS: 20000 });
      console.log(`MongoDB Atlas Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
      return true;
    } catch (error) {
      console.error(`MongoDB Connection Error (${connectUri.includes('srv') ? 'SRV' : 'direct'}): ${error.message}`);
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    }
  }

  try {
    throw new Error('All configured MongoDB URIs failed');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    if (process.env.USE_MEMORY_DB === 'false') {
      console.log('Set USE_MEMORY_DB or install MongoDB locally for persistent data.');
      return false;
    }

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri('gujjar_samaj');
      const conn = await mongoose.connect(memoryUri);
      console.log(`MongoDB in-memory dev database started: ${conn.connection.host}`);
      console.log('Install MongoDB locally or set MONGODB_URI in server/.env for production data.');
      return true;
    } catch (memErr) {
      console.error(`In-memory MongoDB fallback failed: ${memErr.message}`);
      return false;
    }
  }
};

module.exports = connectDB;
