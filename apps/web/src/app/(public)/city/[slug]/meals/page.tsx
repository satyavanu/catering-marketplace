'use client';

import { useParams } from 'next/navigation';
import MealPackagesPage from '../../../meal-plans/page';

export default function CityMealsPage() {
  const params = useParams();
  const citySlug = params.slug as string;

  return <MealPackagesPage initialCity={citySlug} />;
}