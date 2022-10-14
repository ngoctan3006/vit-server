import express from 'express';
import cors from 'cors';
import connectDB from './database/mongoDB.js';
import route from './routes/index.js';

// Connect to MongoDB
connectDB();

// prototype
Array.prototype.checkIntersection = function (arr) {
    return this.some((el) => arr.includes(el));
};

const app = express();
app.use(express.json());
app.use(cors());

route(app);

const PORT = process.env.PORT || 2109;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
