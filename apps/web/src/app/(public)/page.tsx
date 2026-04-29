import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryTabs from '@/components/CategoryTabs';
import CaterList from '@/components/CaterList';
import LatestMenus from '@/components/LatestMenus';
import LatestCaters from '@/components/LatestCaters';
import CustomerReviews from '@/components/CustomerReviews';
import HowItWorks from '@/components/HowItWorks';
import SocialProof from '@/components/SocialProof';
import MealPlans from '@/components/MealPlans';
import QuickBooking from '@/components/QuickBooking';
import BecomeChefCTA from '@/components/BecomeChef';

export default function HomePage() {
  return (
    <main>
      <QuickBooking />
      <BecomeChefCTA />
    </main>
  );
}