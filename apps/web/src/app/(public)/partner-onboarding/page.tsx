import { Suspense } from 'react';
import PartnerOnboardingCampaign from './partner-onboarding-campaign';

export default function PartnerOnboardingPage() {
  return (
    <Suspense fallback={null}>
      <PartnerOnboardingCampaign />
    </Suspense>
  );
}
