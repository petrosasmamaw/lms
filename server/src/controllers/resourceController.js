import { success, error } from '../utils/response.js';
import * as resourceService from '../services/resourceService.js';
import cloudinary from '../config/cloudinary.js';
import {
  getCloudinaryUploadOptions,
  mapResourcesWithDeliveryUrls,
} from '../utils/cloudinaryDelivery.js';
import fs from 'fs/promises';

function mapResourceType(mimetype = '', filename = '') {
  if (mimetype.includes('pdf') || filename.endsWith('.pdf')) return 'pdf';
  if (mimetype.includes('video') || /\.(mp4|mov|webm)$/i.test(filename)) return 'video';
  return 'doc';
}

export async function uploadResource(req, res, next) {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);

    const courseId = req.body.courseId || req.body.course_id;
    if (!courseId) return error(res, 'courseId is required', 400);

    const type = req.body.type || mapResourceType(req.file.mimetype, req.file.originalname);
    const uploadOptions = getCloudinaryUploadOptions(
      req.file.mimetype,
      req.file.originalname,
      type,
    );

    const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);

    await fs.unlink(req.file.path).catch(() => {});

    const resource = await resourceService.createResource({
      courseId: Number(courseId),
      title: req.body.title || req.file.originalname,
      type,
      url: result.secure_url,
      publicId: result.public_id,
    });

    const [withUrl] = mapResourcesWithDeliveryUrls([resource]);
    return success(res, { resource: withUrl }, 'Resource uploaded', 201);
  } catch (err) {
    next(err);
  }
}

export async function listResources(req, res, next) {
  try {
    const { courseId } = req.query;
    if (!courseId) return error(res, 'courseId query required', 400);
    const list = await resourceService.getResourcesByCourse(courseId);
    return success(res, { resources: mapResourcesWithDeliveryUrls(list) }, 'Resources');
  } catch (err) {
    next(err);
  }
}

export async function deleteResource(req, res, next) {
  try {
    const existing = await resourceService.getResourceById(req.params.id);
    if (existing?.publicId) {
      const resourceType = existing.url?.includes('/video/upload/')
        ? 'video'
        : existing.url?.includes('/image/upload/')
          ? 'image'
          : 'raw';
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: resourceType }).catch(() => {});
    }
    await resourceService.deleteResource(req.params.id);
    return success(res, {}, 'Resource deleted');
  } catch (err) {
    next(err);
  }
}
