import dbConnect from '@/lib/mongodb';
import { SiteContent } from '@/models/SiteContent';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Review } from '@/models/Review';
import HeroVideo from '@/components/home/HeroVideo';
import NavButtons from '@/components/home/NavButtons';
import InfluencerSection from '@/components/home/InfluencerSection';
import DispatchMagicSection from '@/components/home/PrernaMagicSection';
import CollectionSection from '@/components/home/CollectionSection';
import NewArrivalsCarousel from '@/components/home/NewArrivalsCarousel';
import InstaSection from '@/components/home/InstaSection';
import HappyClientDiary from '@/components/home/HappyClientDiary';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';

const LOCAL_UPLOAD_PREFIX = '/uploads/';

const isLocalUploadUrl = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith(LOCAL_UPLOAD_PREFIX);

async function getData() {
  await dbConnect();

  const content = await SiteContent.findOne({}).lean();
  const newArrivals = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('category')
    .lean();
  const categories = await Category.find({}).lean();
  const reviews = await Review.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const sanitizedContent = content ? JSON.parse(JSON.stringify(content)) : null;
  const serializedNewArrivals = JSON.parse(JSON.stringify(newArrivals));
  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedReviews = JSON.parse(JSON.stringify(reviews));

  const newArrivalsWithLocalImages = serializedNewArrivals
    .map((product: any) => ({
      ...product,
      images: Array.isArray(product.images) ? product.images.filter(isLocalUploadUrl) : [],
    }))
    .filter((product: any) => product.images.length > 0);

  const categoriesWithLocalImages = serializedCategories.map((category: any) => ({
    ...category,
    image: isLocalUploadUrl(category.image) ? category.image : '/logo.png',
  }));

  const featuredReviewsWithLocalImages = serializedReviews.map((review: any) => ({
    ...review,
    userImage: isLocalUploadUrl(review.userImage) ? review.userImage : undefined,
    images: Array.isArray(review.images) ? review.images.filter(isLocalUploadUrl) : [],
  }));

  return {
    heroImages: sanitizedContent?.heroImages || [],
    influencerVideos: sanitizedContent?.influencerVideos || [],
    dispatchVideos: sanitizedContent?.dispatchVideos || [],
    newArrivals: newArrivalsWithLocalImages,
    categories: categoriesWithLocalImages,
    reviews: featuredReviewsWithLocalImages,
  };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-white">
      <HeroVideo />
      <NavButtons />
      <InfluencerSection videos={data.influencerVideos} />
      <HappyClientDiary />
      <DispatchMagicSection videos={data.dispatchVideos} />
      <NewArrivalsCarousel products={data.newArrivals} />
      {/* <CustomizeSection /> */}
      <CollectionSection categories={data.categories} />
      <InstaSection />
      <CustomerReviewsSection reviews={data.reviews} />
    </main>
  );
}
