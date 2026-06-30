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

  // CORS — allow the deployed frontend origin or all origins in dev
  const allowedOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Render health checks)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json());

  // Health-check endpoint (used by Render to verify the service is up)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount Routes
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/checkin', require('./routes/checkInRoutes'));
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));

  // Root Route
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the "How Cooked Am I? 🔥" API' });
  });

  // Port Configuration — Render injects PORT automatically
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database mode: ${global.useMockDb ? 'Mock (JSON file)' : 'MongoDB'}`);
  });

  // Graceful shutdown — Render sends SIGTERM before stopping the container
  const shutdown = () => {
    console.log('Received shutdown signal, closing server gracefully...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    // Force-exit after 10 s if connections hang
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
