import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import route from './routes/index.js';

dotenv.config();

// prototype
Array.prototype.checkIntersection = function (arr) {
  return this.some((el) => arr.includes(el));
};

const app = express();
app.use(express.json({ limit: '30mb', extended: true }));
app.use(cors());

route(app);

const PORT = process.env.PORT || 2109;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message));
