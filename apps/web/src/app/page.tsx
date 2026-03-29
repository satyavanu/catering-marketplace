import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryTabs from '@/components/CategoryTabs';
import CaterList from '@/components/CaterList';
import LatestMenus from '@/components/LatestMenus';
import LatestCaters from '@/components/LatestCaters';
import CustomerReviews from '@/components/CustomerReviews';
import HowItWorks from '@/components/HowItWorks';
import SocialProof from '@/components/SocialProof';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SocialProof />
      <HowItWorks />
      <CategoryTabs />
      <LatestCaters />
    </main>
  );
}