const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const startServer = async () => {
  // Connect to Database (determines global.useMockDb status)
  await connectDB();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Mount Routes
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/checkin', require('./routes/checkInRoutes'));
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));

  // Basic Test Route
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the "How Cooked Am I? 🔥" API' });
  });

  // Port Configuration
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running in mode on port ${PORT}`);
  });
};

startServer();
