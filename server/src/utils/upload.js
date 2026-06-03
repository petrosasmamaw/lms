import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { getCloudinaryUploadOptions } from './cloudinaryDelivery.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export async function uploadToCloudinary(buffer, filename = 'file', mimetype = '', type = 'doc') {
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimetype || 'application/octet-stream'};base64,${base64}`;
  const options = getCloudinaryUploadOptions(mimetype, filename, type);
  return cloudinary.uploader.upload(dataUri, options);
}
