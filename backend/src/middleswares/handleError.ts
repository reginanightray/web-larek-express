import { Request, Response, NextFunction } from 'express';
import { CelebrateError } from 'celebrate';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CelebrateError) {
    return res.status(400).json({
      message: 'Ошибка валидации'
    });
  }
  
  if (err instanceof Error && err.message.includes('E11000')) {
    return res.status(409).json({
      message: 'Ошибка при создании товара с уже существующим полем title',
    });
  }
  const statusCode = 'statusCode' in err ? err.statusCode : 500;

  return res.status(statusCode).send({
    message: err.message || 'Внутренняя ошибка сервера',
  });
};

export default errorHandler;
