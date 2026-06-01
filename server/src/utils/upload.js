import multer from 'multer';
import cloudinary from './cloudinary.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export async function uploadToCloudinary(buffer, folder = 'lms_resources') {
  // Cloudinary can accept base64 stream; we upload via buffer by converting to data URI
  const base64 = buffer.toString('base64');
  const dataUri = `data:application/octet-stream;base64,${base64}`;
  const res = await cloudinary.uploader.upload(dataUri, { folder, resource_type: 'auto' });
  return res; // contains url, public_id, etc.
}
