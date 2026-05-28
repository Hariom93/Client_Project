require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 20000 });
  const pending = await User.find({ status: 'pending' }).select('name email role status');
  console.log('Pending users:', pending.length);
  pending.forEach((u) => console.log(` - ${u.name} <${u.email}> (${u.role})`));

  const result = await User.updateMany(
    { status: 'pending', role: { $ne: 'admin' } },
    { $set: { status: 'approved' } }
  );
  console.log('Approved:', result.modifiedCount);
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
