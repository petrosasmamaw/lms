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

/**
 * PDFs upload as image (inline browser viewing).
 * Videos use resource_type video.
 * DOC/DOCX use raw with the original extension preserved in public_id.
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
    use_filename: false,
    unique_filename: true,
    access_mode: 'public',
  };

  if (isVideo) {
    return {
      ...baseOptions,
      resource_type: 'video',
      public_id: ext ? `${base}${ext}` : base,
    };
  }

  if (isPdf) {
    return {
      ...baseOptions,
      resource_type: 'image',
      format: 'pdf',
      public_id: base,
      flags: 'attachment:false',
    };
  }

  return {
    ...baseOptions,
    resource_type: 'raw',
    public_id: ext ? `${base}${ext}` : base,
    flags: 'attachment:false',
  };
}

function inferStoredResourceType(url = '', type = '') {
  if (type === 'video' || url.includes('/video/upload/')) return 'video';
  if (type === 'pdf') {
    if (url.includes('/image/upload/')) return 'image';
    if (url.includes('/raw/upload/')) return 'raw';
    return 'image';
  }
  return 'raw';
}

/** Build a browser-friendly URL for viewing in iframe/browser */
export function getResourceDeliveryUrl(resource) {
  const { url, publicId, type } = resource;
  if (!url || !publicId) return url;

  try {
    const storedType = inferStoredResourceType(url, type);

    if (storedType === 'video') {
      return cloudinary.url(publicId, {
        resource_type: 'video',
        type: 'upload',
        secure: true,
      });
    }

    if (type === 'pdf' && storedType === 'image') {
      return cloudinary.url(publicId, {
        resource_type: 'image',
        type: 'upload',
        secure: true,
        format: 'pdf',
        flags: 'attachment:false',
      });
    }

    if (type === 'pdf' && storedType === 'raw') {
      return cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'upload',
        secure: true,
        flags: 'attachment:false',
      });
    }

    if (type === 'doc') {
      return cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'upload',
        secure: true,
      });
    }

    return url;
  } catch (err) {
    console.error('Error generating delivery URL:', err);
    return url;
  }
}

export function mapResourcesWithDeliveryUrls(resources) {
  return resources.map((r) => ({
    ...r,
    url: getResourceDeliveryUrl(r),
  }));
}
