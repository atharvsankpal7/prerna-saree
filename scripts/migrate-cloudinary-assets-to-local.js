const path = require('path');
const { randomUUID } = require('crypto');
const { mkdir, writeFile } = require('fs/promises');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  images: [String],
});

const CategorySchema = new mongoose.Schema({
  image: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const parseArgs = (argv) => {
  const options = {
    apply: false,
    publicRoot: path.resolve(process.cwd(), 'public'),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--apply') {
      options.apply = true;
      continue;
    }

    if (arg === '--public-root') {
      options.publicRoot = path.resolve(process.cwd(), argv[i + 1] || 'public');
      i += 1;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/migrate-cloudinary-assets-to-local.js [--apply] [--public-root <path>]');
      console.log('');
      console.log('Default mode is dry-run. Use --apply to write files and update DB.');
      process.exit(0);
    }
  }

  return options;
};

const isCloudinaryImageUrl = (value) =>
  typeof value === 'string' && /cloudinary\.com/i.test(value) && /\/image\/upload\//i.test(value);

const sanitizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const getUrlPathname = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch (error) {
    return null;
  }
};

const getNameAndExtensionFromUrl = (url) => {
  const pathname = getUrlPathname(url);
  if (!pathname) {
    return { stem: 'asset', ext: null };
  }

  const base = decodeURIComponent(path.basename(pathname));
  const parsed = path.parse(base);
  const cleanStem = sanitizeName(parsed.name || 'asset') || 'asset';
  const cleanExt = parsed.ext ? parsed.ext.replace('.', '').toLowerCase() : null;
  return { stem: cleanStem, ext: cleanExt || null };
};

const getExtensionFromContentType = (contentType) => {
  const normalized = String(contentType || '').toLowerCase();
  if (normalized.includes('image/jpeg') || normalized.includes('image/jpg')) return 'jpg';
  if (normalized.includes('image/png')) return 'png';
  if (normalized.includes('image/webp')) return 'webp';
  if (normalized.includes('image/gif')) return 'gif';
  if (normalized.includes('image/avif')) return 'avif';
  if (normalized.includes('image/svg+xml')) return 'svg';
  return null;
};

const downloadImage = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type');
    return { buffer, contentType };
  } finally {
    clearTimeout(timeoutId);
  }
};

const createLocalUrl = (folder, fileName) => path.posix.join('/uploads', folder, fileName);

const migrateCloudinaryUrl = async ({
  oldUrl,
  folder,
  options,
  cache,
  counters,
}) => {
  const cacheKey = `${folder}::${oldUrl}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const { stem, ext: extFromUrl } = getNameAndExtensionFromUrl(oldUrl);
  let extension = extFromUrl;
  let fileBuffer = null;

  if (options.apply) {
    const download = await downloadImage(oldUrl);
    fileBuffer = download.buffer;
    if (!extension) {
      extension = getExtensionFromContentType(download.contentType);
    }
    if (!extension) {
      extension = 'jpg';
    }
  } else {
    extension = extension || 'jpg';
  }

  const fileName = `${Date.now()}-${randomUUID()}-${stem}.${extension}`;
  const localUrl = createLocalUrl(folder, fileName);
  cache.set(cacheKey, localUrl);

  if (options.apply) {
    const targetDir = path.join(options.publicRoot, 'uploads', folder);
    const targetFile = path.join(targetDir, fileName);

    await mkdir(targetDir, { recursive: true });
    await writeFile(targetFile, fileBuffer);
    counters.filesDownloaded += 1;
  }

  return localUrl;
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const cache = new Map();
  const unresolved = [];

  const counters = {
    cloudinaryUrlsFound: 0,
    urlsUpdated: 0,
    filesDownloaded: 0,
    productDocsUpdated: 0,
    categoryDocsUpdated: 0,
  };

  console.log(`Mode: ${options.apply ? 'APPLY' : 'DRY-RUN'}`);
  console.log(`Public root: ${options.publicRoot}`);

  await mongoose.connect(MONGODB_URI);

  try {
    const products = await Product.find({}, { images: 1 }).lean();
    for (const product of products) {
      const currentImages = Array.isArray(product.images) ? product.images : [];
      const nextImages = [...currentImages];
      let docChanged = false;

      for (let index = 0; index < currentImages.length; index += 1) {
        const image = currentImages[index];
        if (!isCloudinaryImageUrl(image)) {
          continue;
        }

        counters.cloudinaryUrlsFound += 1;

        try {
          const localUrl = await migrateCloudinaryUrl({
            oldUrl: image,
            folder: 'products',
            options,
            cache,
            counters,
          });
          if (localUrl !== image) {
            nextImages[index] = localUrl;
            docChanged = true;
            counters.urlsUpdated += 1;
          }
        } catch (error) {
          unresolved.push({
            model: 'Product',
            id: String(product._id),
            field: `images[${index}]`,
            oldUrl: image,
            reason: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      if (docChanged) {
        counters.productDocsUpdated += 1;
        if (options.apply) {
          await Product.updateOne({ _id: product._id }, { images: nextImages });
        }
      }
    }

    const categories = await Category.find({}, { image: 1 }).lean();
    for (const category of categories) {
      const image = category.image;
      if (!isCloudinaryImageUrl(image)) {
        continue;
      }

      counters.cloudinaryUrlsFound += 1;

      try {
        const localUrl = await migrateCloudinaryUrl({
          oldUrl: image,
          folder: 'categories',
          options,
          cache,
          counters,
        });

        if (localUrl !== image) {
          counters.urlsUpdated += 1;
          counters.categoryDocsUpdated += 1;
          if (options.apply) {
            await Category.updateOne({ _id: category._id }, { image: localUrl });
          }
        }
      } catch (error) {
        unresolved.push({
          model: 'Category',
          id: String(category._id),
          field: 'image',
          oldUrl: image,
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log('');
    console.log('Migration summary');
    console.log(`- Cloudinary URLs found: ${counters.cloudinaryUrlsFound}`);
    console.log(`- URLs updated: ${counters.urlsUpdated}`);
    console.log(`- Product docs updated: ${counters.productDocsUpdated}`);
    console.log(`- Category docs updated: ${counters.categoryDocsUpdated}`);
    console.log(`- Files downloaded: ${counters.filesDownloaded}`);
    console.log(`- Unresolved URLs: ${unresolved.length}`);

    if (unresolved.length > 0) {
      console.log('');
      console.log('Unresolved entries (first 50):');
      unresolved.slice(0, 50).forEach((entry, index) => {
        console.log(
          `${index + 1}. ${entry.model}:${entry.id} ${entry.field} reason=${entry.reason} url=${entry.oldUrl}`,
        );
      });
    }

    if (!options.apply) {
      console.log('');
      console.log('Dry-run only. Re-run with --apply to write files and update DB.');
    }
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
