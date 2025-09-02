// Minimal Vercel Blob client helper for browser usage with Vite
// Expects `VITE_BLOB_READ_WRITE_TOKEN` in your env (do not expose in prod)

import { upload } from '@vercel/blob/client';

function getToken() {
  const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      'Missing VITE_BLOB_READ_WRITE_TOKEN. Set it in .env.local.'
    );
  }
  return token;
}

/**
 * Upload a File/Blob directly from the browser to Vercel Blob.
 * Returns the created blob metadata including the public `url`.
 *
 * Example:
 *   const res = await uploadFile(file, { access: 'public' })
 *   console.log(res.url)
 */
export async function uploadFile(file, options = {}) {
  const token = getToken();
  // access: 'public' | 'private'
  const { access = 'public', contentType } = options;
  const res = await upload(file.name ?? 'upload.bin', file, {
    access,
    token,
    contentType,
  });
  return res; // { url, pathname, contentType, uploadedAt, size }
}

