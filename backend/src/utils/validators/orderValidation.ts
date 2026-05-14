import Product from '../../models/product';

export interface OrderData {
  items: string[];
  total: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const orderValidator = async (data: OrderData): Promise<ValidationResult> => {
  const errors = [];

  const { total, items } = data;

  // проверка, что в массиве все товары c существующим _id и price не равен null
  try {
    const existingProducts = await Product.find({ _id: { $in: items } });

    if (existingProducts.length !== items.length) {
      errors.push('ID товара не найдено');
    }

    if (existingProducts.some((p) => p.price === null)) {
      errors.push('В корзине бесценный товар');
    }

    const totalInBasket = existingProducts.reduce((sum, product) => sum + product.price, 0);

    if (totalInBasket !== total) {
      errors.push('Не совпадает стоимость товаров в корзине');
    }
  } catch (error) {
    errors.push('У сервера что-то пошло не так');
  }

  return { isValid: errors.length === 0, errors };
};
