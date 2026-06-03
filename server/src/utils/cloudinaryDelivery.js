import cloudinary from '../config/cloudinary.js';

/**
 * PDFs and documents must use resource_type "raw" so browsers can open them.
 * "auto" / "image" puts PDFs under /image/upload/ which often fails to open.
 */
export function getCloudinaryUploadOptions(mimetype = '', filename = '', type = 'doc') {
  const lower = (filename || '').toLowerCase();
  const isVideo =
    type === 'video' ||
    mimetype.startsWith('video/') ||
    /\.(mp4|mov|webm)$/i.test(lower);
  const isPdf =
    type === 'pdf' ||
    mimetype === 'application/pdf' ||
    lower.endsWith('.pdf');
  const isDoc =
    type === 'doc' ||
    /\.(doc|docx)$/i.test(lower);

  const base = {
    folder: 'lms_resources',
    use_filename: true,
    unique_filename: true,
    access_mode: 'public',
  };

  if (isVideo) {
    return { ...base, resource_type: 'video' };
  }
  if (isPdf || isDoc) {
    return { ...base, resource_type: 'raw' };
  }
  return { ...base, resource_type: 'raw' };
}

function inferStoredResourceType(resource) {
  const { type, url } = resource;
  if (url?.includes('/video/upload/')) return 'video';
  if (url?.includes('/raw/upload/')) return 'raw';
  if (url?.includes('/image/upload/')) return 'image';
  if (type === 'video') return 'video';
  if (type === 'pdf' || type === 'doc') return 'raw';
  return 'raw';
}

/** Build a browser-friendly URL (fixes legacy image-stored PDFs when possible). */
export function getResourceDeliveryUrl(resource) {
  const { url, publicId, type } = resource;
  if (!url) return url;

  if (!publicId) return url;

  const resourceType = inferStoredResourceType(resource);

  try {
    const options = {
      resource_type: resourceType,
      type: 'upload',
      secure: true,
    };
    if (type === 'pdf' && resourceType === 'image') {
      options.format = 'pdf';
    }
    return cloudinary.url(publicId, options);
  } catch {
    return url;
  }
}

export function mapResourcesWithDeliveryUrls(resources) {
  return resources.map((r) => ({
    ...r,
    url: getResourceDeliveryUrl(r),
  }));
}
