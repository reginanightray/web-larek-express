import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { total, items } = req.body;

  try {
    // проверка, что в массиве все товары c существующим _id и price не равен null

    const existingProducts = await Product.find({ _id: { $in: items } });

    if (existingProducts.length !== items.length) {
      throw new BadRequestError('Товар не существует');
    }

    if (existingProducts.some((p) => p.price === null)) {
      throw new BadRequestError('В корзине бесценный товар');
    }

    const totalInBasket = existingProducts.reduce((sum, product) => sum + (product.price || 0), 0);

    if (totalInBasket !== total) {
      throw new BadRequestError('Не совпадает стоимость товаров в корзине');
    }
    const orderId = new mongoose.Types.ObjectId().toString();

    res.status(200).send({ id: orderId, total: totalInBasket });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
