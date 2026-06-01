const mongoose = require('mongoose');
const uri = "mongodb://hariomchoudhary557_db_user:hari93020@ac-zf66sgm-shard-00-00.caknmk8.mongodb.net:27017,ac-zf66sgm-shard-00-01.caknmk8.mongodb.net:27017,ac-zf66sgm-shard-00-02.caknmk8.mongodb.net:27017/gujjar_samaj?ssl=true&replicaSet=atlas-109nt7-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

console.log("Testing connection to MongoDB Atlas...");
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILURE: Could not connect to MongoDB Atlas:", err.message);
    process.exit(1);
  });
