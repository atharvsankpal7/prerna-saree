import RunningBanner from '@/components/RunningBanner';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CelebrationSection from '@/components/CelebrationSection';
import NewArrivalsCarousel from '@/components/NewArrivalsCarousel';
import CustomizeSection from '@/components/CustomizeSection';
import CollectionSection from '@/components/CollectionSection';
import CustomerReviewsSection from '@/components/CustomerReviewsSection';
import NavButtons from '@/components/NavButtons';
import DispatchMagicSection from '@/components/DispatchMagicSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <NavButtons />
      <CelebrationSection />
      <DispatchMagicSection />

      <CollectionSection />
      <NewArrivalsCarousel />
      <CustomizeSection />
      <CustomerReviewsSection />
    </main>
  );
}
