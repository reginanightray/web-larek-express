import { celebrate, Joi, Segments } from 'celebrate';

// Валидация для создания товара
export const validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    description: Joi.string().optional(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }),
    category: Joi.string().required(),
    price: Joi.number().allow(null).default(null),
  }),
});

export const validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('online', 'card').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().positive().required(),
    items: Joi.array().items(Joi.string()).min(1).required(),
  }),
});
