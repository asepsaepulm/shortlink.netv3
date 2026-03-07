import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <Navbar />
      <HeroSection />
    </main>
  );
}
