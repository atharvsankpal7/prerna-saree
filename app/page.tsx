import RunningBanner from '@/components/RunningBanner';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CelebrationSection from '@/components/CelebrationSection';
import NewArrivalsCarousel from '@/components/NewArrivalsCarousel';
import CustomizeSection from '@/components/CustomizeSection';
import CollectionSection from '@/components/CollectionSection';
import CustomerReviewsSection from '@/components/CustomerReviewsSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CelebrationSection />
      <CollectionSection />
      <NewArrivalsCarousel />
      <CustomizeSection />
      <CustomerReviewsSection />
    </main>
  );
}
