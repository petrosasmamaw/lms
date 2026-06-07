import path from 'path';

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
 * Upload options per file type.
 * Always keep the file extension in public_id for raw files (PDF/DOCX) so
 * Cloudinary serves the correct content-type and browsers can open them.
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
      resource_type: 'raw',
      public_id: `${base}.pdf`,
    };
  }

  return {
    ...baseOptions,
    resource_type: 'raw',
    public_id: ext ? `${base}${ext}` : base,
  };
}

/**
 * Return the stored Cloudinary secure_url as-is.
 * Regenerating URLs via cloudinary.url() produces wrong version (v1) and
 * transformation flags that cause 404/401 errors on delivery.
 */
export function getResourceDeliveryUrl(resource) {
  return resource?.url || '';
}

export function mapResourcesWithDeliveryUrls(resources) {
  return resources.map((r) => ({
    ...r,
    url: getResourceDeliveryUrl(r),
  }));
}
