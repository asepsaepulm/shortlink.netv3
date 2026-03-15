import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import { getStats } from '@/lib/statsTracker';

export default async function HomePage() {
  const initialStats = await getStats();

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <Navbar />
      <HeroSection initialStats={initialStats} />
    </main>
  );
}
