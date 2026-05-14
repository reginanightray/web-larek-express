import { Router, Request, Response } from 'express';
import { getProducts, createProduct } from '../controllers/products';

const router = Router();

router.post('/', createProduct);

router.get('/', getProducts);

export default router;