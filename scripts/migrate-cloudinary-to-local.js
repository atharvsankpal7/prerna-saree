const fs = require('fs');
const path = require('path');
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

const ReviewSchema = new mongoose.Schema({
  images: [String],
  userImage: String,
});

const SiteContentSchema = new mongoose.Schema({
  heroImages: [String],
  dispatchVideos: [
    {
      thumbnail: String,
      url: String,
    },
  ],
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

const parseArgs = (argv) => {
  const options = {
    apply: false,
    strict: false,
    mappingPath: null,
    publicRoot: path.resolve(process.cwd(), 'public'),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') {
      options.apply = true;
      continue;
    }

    if (arg === '--strict') {
      options.strict = true;
      continue;
    }

    if (arg === '--mapping') {
      options.mappingPath = argv[i + 1] || null;
      i += 1;
      continue;
    }

    if (arg === '--public-root') {
      options.publicRoot = path.resolve(process.cwd(), argv[i + 1] || 'public');
      i += 1;
      continue;
    }
  }

  return options;
};

const isCloudinaryImageUrl = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  return /cloudinary\.com/i.test(value) && /\/image\/upload\//i.test(value);
};

const toPosixPath = (value) => value.replace(/\\/g, '/');

const normalizeLocalUrl = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const input = value.trim();
  if (/^https?:\/\//i.test(input)) {
    try {
      const parsed = new URL(input);
      return toPosixPath(parsed.pathname);
    } catch (error) {
      return null;
    }
  }

  if (input.startsWith('/')) {
    return toPosixPath(input);
  }

  const withoutPublicPrefix = input.replace(/^public[\\/]/i, '');
  return `/${toPosixPath(withoutPublicPrefix)}`;
};

const loadMapping = (mappingPath) => {
  if (!mappingPath) {
    return new Map();
  }

  const absolutePath = path.resolve(process.cwd(), mappingPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Mapping file not found: ${absolutePath}`);
  }

  const raw = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  const mapping = new Map();

  if (Array.isArray(raw)) {
    for (const entry of raw) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }
      const from = entry.from || entry.oldUrl;
      const to = entry.to || entry.newUrl;
      const normalizedTo = normalizeLocalUrl(to);
      if (typeof from === 'string' && normalizedTo) {
        mapping.set(from, normalizedTo);
      }
    }
    return mapping;
  }

  if (raw && typeof raw === 'object') {
    for (const [from, to] of Object.entries(raw)) {
      const normalizedTo = normalizeLocalUrl(to);
      if (normalizedTo) {
        mapping.set(from, normalizedTo);
      }
    }
  }

  return mapping;
};

const walkFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
    } else {
      files.push(absolutePath);
    }
  }

  return files;
};

const buildFileIndexes = (publicRoot) => {
  if (!fs.existsSync(publicRoot)) {
    return {
      byBasename: new Map(),
      allUrls: new Set(),
    };
  }

  const allFiles = walkFiles(publicRoot);
  const byBasename = new Map();
  const allUrls = new Set();

  for (const filePath of allFiles) {
    const rel = toPosixPath(path.relative(publicRoot, filePath));
    const url = `/${rel}`;
    const basename = path.basename(filePath).toLowerCase();
    allUrls.add(url);

    if (!byBasename.has(basename)) {
      byBasename.set(basename, []);
    }
    byBasename.get(basename).push(url);
  }

  return { byBasename, allUrls };
};

const getCloudinaryFilename = (url) => {
  try {
    const parsed = new URL(url);
    const fileName = path.basename(parsed.pathname);
    return decodeURIComponent(fileName).toLowerCase();
  } catch (error) {
    return null;
  }
};

const pickCandidate = (candidates, preferredFolders) => {
  if (candidates.length === 0) {
    return null;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  if (preferredFolders.length > 0) {
    for (const folder of preferredFolders) {
      const scoped = candidates.filter((url) => url.startsWith(`/uploads/${folder}/`));
      if (scoped.length === 1) {
        return scoped[0];
      }
    }
  }

  return null;
};

const resolveNewUrl = ({
  oldUrl,
  mapping,
  strict,
  byBasename,
  allUrls,
  preferredFolders,
}) => {
  if (mapping.has(oldUrl)) {
    const mapped = mapping.get(oldUrl);
    if (allUrls.has(mapped)) {
      return { nextUrl: mapped, source: 'mapping' };
    }
    return { nextUrl: null, source: 'mapping_missing_file' };
  }

  if (strict) {
    return { nextUrl: null, source: 'strict_no_mapping' };
  }

  const fileName = getCloudinaryFilename(oldUrl);
  if (!fileName) {
    return { nextUrl: null, source: 'invalid_url' };
  }

  const candidates = byBasename.get(fileName) || [];
  const chosen = pickCandidate(candidates, preferredFolders);
  if (!chosen) {
    if (candidates.length > 1) {
      return { nextUrl: null, source: 'ambiguous_matches' };
    }
    return { nextUrl: null, source: 'no_local_match' };
  }

  return { nextUrl: chosen, source: 'basename_match' };
};

const convertArray = ({
  values,
  context,
  mapping,
  strict,
  indexes,
  preferredFolders,
  unresolved,
  counters,
}) => {
  let changed = false;

  const next = values.map((value, index) => {
    if (!isCloudinaryImageUrl(value)) {
      return value;
    }

    counters.cloudinaryUrlsSeen += 1;

    const { nextUrl, source } = resolveNewUrl({
      oldUrl: value,
      mapping,
      strict,
      byBasename: indexes.byBasename,
      allUrls: indexes.allUrls,
      preferredFolders,
    });

    if (!nextUrl) {
      unresolved.push({
        ...context,
        index,
        field: context.field,
        oldUrl: value,
        reason: source,
      });
      return value;
    }

    if (nextUrl !== value) {
      changed = true;
      counters.urlsReplaced += 1;
    }

    return nextUrl;
  });

  return { changed, next };
};

const convertSingle = ({
  value,
  context,
  mapping,
  strict,
  indexes,
  preferredFolders,
  unresolved,
  counters,
}) => {
  if (!isCloudinaryImageUrl(value)) {
    return { changed: false, next: value };
  }

  counters.cloudinaryUrlsSeen += 1;

  const { nextUrl, source } = resolveNewUrl({
    oldUrl: value,
    mapping,
    strict,
    byBasename: indexes.byBasename,
    allUrls: indexes.allUrls,
    preferredFolders,
  });

  if (!nextUrl) {
    unresolved.push({
      ...context,
      oldUrl: value,
      reason: source,
    });
    return { changed: false, next: value };
  }

  if (nextUrl !== value) {
    counters.urlsReplaced += 1;
    return { changed: true, next: nextUrl };
  }

  return { changed: false, next: value };
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const mapping = loadMapping(options.mappingPath);
  const indexes = buildFileIndexes(options.publicRoot);
  const unresolved = [];

  const counters = {
    cloudinaryUrlsSeen: 0,
    urlsReplaced: 0,
    productDocsUpdated: 0,
    categoryDocsUpdated: 0,
    reviewDocsUpdated: 0,
    siteContentDocsUpdated: 0,
  };

  console.log(`Mode: ${options.apply ? 'APPLY' : 'DRY-RUN'}`);
  console.log(`Public root: ${options.publicRoot}`);
  console.log(`Known local files: ${indexes.allUrls.size}`);
  console.log(`Mapping entries: ${mapping.size}`);

  await mongoose.connect(MONGODB_URI);

  try {
    const products = await Product.find({}, { images: 1 }).lean();
    for (const product of products) {
      const current = Array.isArray(product.images) ? product.images : [];
      const { changed, next } = convertArray({
        values: current,
        context: { model: 'Product', id: String(product._id), field: 'images' },
        mapping,
        strict: options.strict,
        indexes,
        preferredFolders: ['products'],
        unresolved,
        counters,
      });

      if (changed) {
        counters.productDocsUpdated += 1;
        if (options.apply) {
          await Product.updateOne({ _id: product._id }, { images: next });
        }
      }
    }

    const categories = await Category.find({}, { image: 1 }).lean();
    for (const category of categories) {
      const { changed, next } = convertSingle({
        value: category.image,
        context: { model: 'Category', id: String(category._id), field: 'image' },
        mapping,
        strict: options.strict,
        indexes,
        preferredFolders: ['categories'],
        unresolved,
        counters,
      });

      if (changed) {
        counters.categoryDocsUpdated += 1;
        if (options.apply) {
          await Category.updateOne({ _id: category._id }, { image: next });
        }
      }
    }

    const reviews = await Review.find({}, { images: 1, userImage: 1 }).lean();
    for (const review of reviews) {
      let docChanged = false;
      const patch = {};

      const images = Array.isArray(review.images) ? review.images : [];
      const imagesResult = convertArray({
        values: images,
        context: { model: 'Review', id: String(review._id), field: 'images' },
        mapping,
        strict: options.strict,
        indexes,
        preferredFolders: ['reviews'],
        unresolved,
        counters,
      });

      if (imagesResult.changed) {
        docChanged = true;
        patch.images = imagesResult.next;
      }

      const userImageResult = convertSingle({
        value: review.userImage,
        context: { model: 'Review', id: String(review._id), field: 'userImage' },
        mapping,
        strict: options.strict,
        indexes,
        preferredFolders: ['reviews'],
        unresolved,
        counters,
      });

      if (userImageResult.changed) {
        docChanged = true;
        patch.userImage = userImageResult.next;
      }

      if (docChanged) {
        counters.reviewDocsUpdated += 1;
        if (options.apply) {
          await Review.updateOne({ _id: review._id }, patch);
        }
      }
    }

    const siteContents = await SiteContent.find({}, { heroImages: 1, dispatchVideos: 1 }).lean();
    for (const content of siteContents) {
      let docChanged = false;
      const patch = {};

      const heroImages = Array.isArray(content.heroImages) ? content.heroImages : [];
      const heroResult = convertArray({
        values: heroImages,
        context: { model: 'SiteContent', id: String(content._id), field: 'heroImages' },
        mapping,
        strict: options.strict,
        indexes,
        preferredFolders: ['products', 'categories'],
        unresolved,
        counters,
      });

      if (heroResult.changed) {
        docChanged = true;
        patch.heroImages = heroResult.next;
      }

      const dispatchVideos = Array.isArray(content.dispatchVideos) ? content.dispatchVideos : [];
      const nextDispatchVideos = dispatchVideos.map((video, index) => {
        const thumbnailResult = convertSingle({
          value: video?.thumbnail,
          context: {
            model: 'SiteContent',
            id: String(content._id),
            field: `dispatchVideos[${index}].thumbnail`,
          },
          mapping,
          strict: options.strict,
          indexes,
          preferredFolders: ['products', 'categories'],
          unresolved,
          counters,
        });

        if (thumbnailResult.changed) {
          docChanged = true;
          return { ...video, thumbnail: thumbnailResult.next };
        }

        return video;
      });

      if (docChanged) {
        patch.dispatchVideos = nextDispatchVideos;
        counters.siteContentDocsUpdated += 1;
        if (options.apply) {
          await SiteContent.updateOne({ _id: content._id }, patch);
        }
      }
    }

    console.log('');
    console.log('Migration summary');
    console.log(`- Cloudinary image URLs found: ${counters.cloudinaryUrlsSeen}`);
    console.log(`- URLs replaced: ${counters.urlsReplaced}`);
    console.log(`- Product docs updated: ${counters.productDocsUpdated}`);
    console.log(`- Category docs updated: ${counters.categoryDocsUpdated}`);
    console.log(`- Review docs updated: ${counters.reviewDocsUpdated}`);
    console.log(`- SiteContent docs updated: ${counters.siteContentDocsUpdated}`);
    console.log(`- Unresolved URLs: ${unresolved.length}`);

    if (unresolved.length > 0) {
      console.log('');
      console.log('Unresolved entries (first 50):');
      unresolved.slice(0, 50).forEach((entry, idx) => {
        console.log(
          `${idx + 1}. ${entry.model}:${entry.id} ${entry.field} reason=${entry.reason} url=${entry.oldUrl}`,
        );
      });
    }

    if (!options.apply) {
      console.log('');
      console.log('Dry-run only. Re-run with --apply to write changes.');
    }
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
