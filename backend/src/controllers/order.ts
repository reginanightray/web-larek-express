import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { orderValidator } from '../utils/validators/orderValidation';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const {
    total, items,
  } = req.body;

  const validation = await orderValidator({ total, items });

  if (!validation.isValid) {
    return next(new BadRequestError(validation.errors.join(', ')));
  }
  // создаем id заказа
  const orderId = faker.string.uuid();

  return res.send({ id: orderId, total });
};

export default createOrder;
