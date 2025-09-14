// Minimal Vercel Blob client helper for browser usage
// In Next.js, expose a read-write token only for local/dev via NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN

import { upload } from '@vercel/blob/client';

function getToken() {
  const token = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      'Missing NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN. Set it in .env.local for local dev only.'
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
