import Product from '../../models/product'
import {PaymentType} from '../../types/payment'
import validator from 'validator'

export interface OrderData {
  items: string[];
  total: number;
  address: string;
  phone: string;
  email: string
  payment: PaymentType;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const orderValidator = async (data: OrderData):Promise<ValidationResult>  => {
  let errors = []

  const {payment, email, phone, address, total, items} = data;
  
  //проверка заполнения обязательных полей
  if (!items || !total || !payment || !email || !phone || !address) {
    errors.push('Не заполнены обязательные поля')
  }
  
  //проверка, что массив товаров - массив и не пустой.  
  if (!Array.isArray(items) || items.length === 0) {
    errors.push('В заказе нет товаров')
  }
  
  //проверка, что в массиве все товары c существующим _id и price не равен null 
  try {
    const existingProducts = await Product.find({_id: {$in: items}})

    if (existingProducts.length !== items.length) {
      errors.push('ID товара не найдено')
    }

    if (existingProducts.some(p => p.price === null) ) {
      errors.push('В корзине бесценный товар')
    }

    const totalInBasket = existingProducts.reduce((sum, product) => sum + product.price, 0)
    
    if (totalInBasket !== total) {
      errors.push('Не совпадает стоимость товаров в корзине')
    }

  } catch(error) {
    errors.push('У сервера что-то пошло не так')
  }
  // Проверяем, есть ли payment в PaymentType
  const validMethods = Object.values(PaymentType);

  if (!validMethods.includes(payment)) {
    errors.push('Неверный метод оплаты')
  }
  
  //Проверяем, что номер телефон - строка
  if (typeof phone !== 'string') {
    errors.push('Телефон не является строкой')
  }

  //Проверяем, что емейл строка и валиден
  if (typeof email !== 'string' || !validator.isEmail(email)) {
    errors.push('Email не является строкой или некорректен');
  }
  
  return { isValid: errors.length === 0, errors}

}