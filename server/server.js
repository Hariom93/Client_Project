require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');
const seedData = require('./config/seed');

// Validate required environment variables on startup
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please check your server/.env file.');
  process.exit(1);
}

// Initialize app
const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local uploaded images in the client
}));

// CORS — restrict to known origins only
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://client-project-nine-rho.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter (limits queries per IP to prevent spamming)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', limiter);

// Serve uploads static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mapping
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/matrimony', require('./routes/matrimonyRoutes'));
app.use('/api/businesses', require('./routes/businessRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Gujjar Samaj MERN Stack API running successfully!' });
});

// Fallback 404 route
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  const isConnected = await connectDB();
  
  if (isConnected) {
    // Seed initial values if DB is empty
    await seedData();
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
