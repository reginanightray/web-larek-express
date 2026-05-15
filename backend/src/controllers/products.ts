import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    description, image, title, category, price,
  } = req.body;

  return Product.create({
    description,
    image,
    title,
    category,
    price,
  })
    .then((products) => res.status(201).send(products))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
        return;
      }
      next(error);
    });
};

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((products) => res.status(200).send({ items: products, total: products.length }))
  .catch((error) => next(error));
