import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';


dotenv.config();

const app = express();

app.use(rateLimiter);

app.use(express.json());

const PORT = process.env.PORT || 5001;


app.use("/api/transactions", transactionsRoute);


initDB().then(() => {
  app.listen(5001, () => {
    console.log('⭕⭕ Server is running on port', PORT);
  });

}).catch((error) => {
  console.error("Failed to initialize the server:", error);
  process.exit(1);
});

