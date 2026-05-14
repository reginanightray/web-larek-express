import mongoose from 'mongoose';

interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description: string;
  price: number;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: {
      fileName: String,
      originalName: String,
    },
    required: true,
    _id: false,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
