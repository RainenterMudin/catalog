import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  // CLOUDINARY_URL from env will be used automatically if available,
  // but we can also just rely on it.
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'catalog_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any, // type assertion for params which sometimes lacks types
});

export const upload = multer({ storage: storage });
