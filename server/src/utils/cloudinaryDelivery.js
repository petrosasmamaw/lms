import path from 'path';
import cloudinary from '../config/cloudinary.js';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.mp4', '.mov', '.webm']);

export function sanitizePublicId(filename = 'file') {
  const ext = path.extname(filename).toLowerCase();
  const base =
    path
      .basename(filename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 80) || 'file';
  return { base, ext };
}

export function isAllowedResourceFile(filename = '') {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

export function parseCloudinaryMeta(url = '') {
  const versionMatch = url.match(/\/upload\/(v\d+)\//);
  const version = versionMatch ? versionMatch[1].slice(1) : undefined;
  let resourceType = 'raw';
  if (url.includes('/video/upload/')) resourceType = 'video';
  else if (url.includes('/image/upload/')) resourceType = 'image';
  return { version, resourceType };
}

/**
 * Upload options per file type.
 * PDFs use image resource_type so Cloudinary serves them publicly in browsers.
 */
export function getCloudinaryUploadOptions(mimetype = '', filename = '', type = 'doc') {
  const lower = (filename || '').toLowerCase();
  const { base, ext } = sanitizePublicId(filename || 'file');
  const isVideo =
    type === 'video' ||
    mimetype.startsWith('video/') ||
    /\.(mp4|mov|webm)$/i.test(lower);
  const isPdf =
    type === 'pdf' ||
    mimetype === 'application/pdf' ||
    lower.endsWith('.pdf');

  const baseOptions = {
    folder: 'lms_resources',
    unique_filename: true,
    access_mode: 'public',
    type: 'upload',
  };

  if (isVideo) {
    return {
      ...baseOptions,
      resource_type: 'video',
      public_id: base,
    };
  }

  if (isPdf) {
    return {
      ...baseOptions,
      resource_type: 'image',
      format: 'pdf',
      public_id: base,
    };
  }

  return {
    ...baseOptions,
    resource_type: 'raw',
    public_id: ext ? `${base}${ext}` : base,
  };
}

function buildSignedPdfUrl(resource) {
  const { url, publicId } = resource;
  const { resourceType } = parseCloudinaryMeta(url);

  return cloudinary.utils.private_download_url(publicId, 'pdf', {
    resource_type: resourceType,
    type: 'upload',
    expires_at: Math.floor(Date.now() / 1000) + 7200,
  });
}

/** Build a browser-friendly URL. PDFs need signed URLs on this Cloudinary account. */
export function getResourceDeliveryUrl(resource) {
  const { url, publicId, type } = resource;
  if (!url || !publicId) return url || '';

  if (type === 'pdf') {
    try {
      return buildSignedPdfUrl(resource);
    } catch (err) {
      console.error('Error generating signed PDF URL:', err);
      return url;
    }
  }

  return url;
}

export function mapResourcesWithDeliveryUrls(resources) {
  return resources.map((r) => ({
    ...r,
    url: getResourceDeliveryUrl(r),
  }));
}
