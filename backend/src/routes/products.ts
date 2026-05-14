import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/products';
import { validateCreateProduct } from '../middleswares/productValidation';

const router = Router();

router.post('/', validateCreateProduct, createProduct);

router.get('/', getProducts);

export default router;
