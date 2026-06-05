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

  const base = {
    folder: 'lms_resources',
    use_filename: true,
    unique_filename: true,
    access_mode: 'public',
  };

  if (isVideo) {
    return { ...base, resource_type: 'video' };
  }
  if (isPdf) {
    // PDFs as raw type with inline display flag
    return { ...base, resource_type: 'raw', flags: 'attachment:false' };
  }
  // Docs as raw type
  return { ...base, resource_type: 'raw', flags: 'attachment:false' };
}

/** Build a browser-friendly URL for viewing in iframe/browser */
export function getResourceDeliveryUrl(resource) {
  const { url, publicId, type } = resource;
  if (!url || !publicId) return url;

  try {
    if (type === 'video') {
      // Videos - use secure URL directly
      return cloudinary.url(publicId, {
        resource_type: 'video',
        type: 'upload',
        secure: true,
      });
    }

    if (type === 'pdf' || type === 'doc') {
      // PDFs and Docs - use raw type with inline flag
      return cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'upload',
        secure: true,
        flags: 'attachment:false',
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
