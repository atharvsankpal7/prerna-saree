import dbConnect from '@/lib/mongodb';
import { SiteContent } from '@/models/SiteContent';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import HeroCarousel from '@/components/home/HeroCarousel';
import NewArrivals from '@/components/home/NewArrivals';
import Collections from '@/components/home/Collections';
import VideoSection from '@/components/home/VideoSection';

async function getData() {
  await dbConnect();

  const content = await SiteContent.findOne({}).lean();
  const newArrivals = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('category')
    .lean();
  const categories = await Category.find({}).lean();

  return {
    heroImages: content?.heroImages || [],
    influencerVideos: content?.influencerVideos || [],
    dispatchVideos: content?.dispatchVideos || [],
    newArrivals: JSON.parse(JSON.stringify(newArrivals)),
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-white">
      <HeroCarousel images={data.heroImages} />

      <div className="container mx-auto px-4 py-12 space-y-16">
        <NewArrivals products={data.newArrivals} />

        <Collections categories={data.categories} />

        <VideoSection
          title="Dispatch Magic"
          videos={data.dispatchVideos}
          type="dispatch"
        />

        <VideoSection
          title="Influencer Feedback"
          videos={data.influencerVideos}
          type="influencer"
        />
      </div>
    </main>
  );
}
