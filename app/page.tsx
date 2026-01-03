import dbConnect from '@/lib/mongodb';
import { SiteContent } from '@/models/SiteContent';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Review } from '@/models/Review';
import HeroSection from '@/components/home/HeroSection';
import NavButtons from '@/components/home/NavButtons';
import InfluencerSection from '@/components/home/InfluencerSection';
import DispatchMagicSection from '@/components/home/DispatchMagicSection';
import CollectionSection from '@/components/home/CollectionSection';
import NewArrivalsCarousel from '@/components/home/NewArrivalsCarousel';
import CustomizeSection from '@/components/home/CustomizeSection';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';

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
    .limit(6)
    .lean();

  const sanitizedContent = content ? JSON.parse(JSON.stringify(content)) : null;

  return {
    heroImages: sanitizedContent?.heroImages || [],
    influencerVideos: sanitizedContent?.influencerVideos || [],
    dispatchVideos: sanitizedContent?.dispatchVideos || [],
    newArrivals: JSON.parse(JSON.stringify(newArrivals)),
    categories: JSON.parse(JSON.stringify(categories)),
    reviews: JSON.parse(JSON.stringify(reviews)),
  };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-white">
      <HeroSection images={data.heroImages} />
      <NavButtons />
      <InfluencerSection videos={data.influencerVideos} />
      <DispatchMagicSection videos={data.dispatchVideos} />

      <CollectionSection categories={data.categories} />
      <NewArrivalsCarousel products={data.newArrivals} />
      <CustomizeSection />
      <CustomerReviewsSection reviews={data.reviews} />
    </main>
  );
}
