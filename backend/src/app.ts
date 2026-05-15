import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { errors as celebrateErrors } from 'celebrate';
import productsRouter from './routes/products';
import orderRouter from './routes/order';
import errorHandler from './middleswares/handleError';
import NotFoundError from './errors/not-found-error';
import { requestLogger, errorLogger } from './middleswares/logger';

dotenv.config();

const { PORT = 3000, BASE_PATH = `http://localhost:${PORT}` } = process.env;

const app = express();
const mongoURI = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.use(requestLogger);
app.use('/product', productsRouter);
app.use('/order', orderRouter);
app.use(celebrateErrors());
app.use(errorLogger);
app.use((_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
