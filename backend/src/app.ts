import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productsRouter from './routes/products'
import orderRouter from './routes/order'
import path from 'path';
import errorHandler from './middleswares/handleError';
import NotFoundError from './errors/not-found-error';


const { PORT = 3000, BASE_PATH } = process.env;

const app = express();
const mongoURI = 'mongodb://127.0.0.1:27017/weblarek';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));


app.use('/product', productsRouter);
app.use('/order', orderRouter)
app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use(errorHandler)
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});

