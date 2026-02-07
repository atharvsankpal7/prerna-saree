import path from 'path';
import { unlink } from 'fs/promises';

const UPLOADS_PREFIX = '/uploads/';

export const isLocalUploadPath = (url: string) =>
  typeof url === 'string' && url.startsWith(UPLOADS_PREFIX);

const resolvePublicFilePath = (url: string) => {
  if (typeof url !== 'string' || !url.startsWith('/')) {
    return null;
  }

  const normalizedUrl = url.replace(/\\/g, '/');
  const relativeUrlPath = normalizedUrl.replace(/^\/+/, '');

  const publicRoot = path.resolve(process.cwd(), 'public');
  const absolutePath = path.resolve(publicRoot, relativeUrlPath);
  const relativeToPublic = path.relative(publicRoot, absolutePath);

  if (relativeToPublic.startsWith('..') || path.isAbsolute(relativeToPublic)) {
    return null;
  }

  return absolutePath;
};

export const deleteLocalUploadFile = async (url: string) => {
  if (!isLocalUploadPath(url)) {
    return;
  }

  const filePath = resolvePublicFilePath(url);
  if (!filePath) {
    return;
  }

  try {
    await unlink(filePath);
  } catch (error: any) {
    if (error?.code !== 'ENOENT') {
      console.error(`Failed deleting local file: ${url}`, error);
    }
  }
};

export const deleteManyLocalUploadFiles = async (urls: string[]) => {
  await Promise.all(urls.map((url) => deleteLocalUploadFile(url)));
};
