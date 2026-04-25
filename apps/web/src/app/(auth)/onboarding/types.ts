export type OnboardingStep =
| 'phone-verification'
| 'basic-profile'
| 'business-details'
| 'service-areas'
| 'kyc-payments'
| 'agreement'
| 'completion';

export interface OnboardingFormData {
email: string;
phone: string;
otp: string;

fullName: string;
partnerType: 'individual' | 'business' | null;
businessName: string;
businessType: string[];
eventsHandled: string[];

// Step 3: Business Details
yearsInBusiness: string;
cuisines: string[];
specializations: string[];
dietTypes: string[];
capacityRange: string;
baseCity: string;

// Step 4: Service Areas
kitchenAddress: string;
kitchenPincode: string;
canServeEntireCity: boolean;
serviceAreas: Array<{ pincode: string; city: string; state: string }>;
deliverySettings: {
  freeDeliveryRadius: number;
  maxDeliveryDistance: number;
  extraChargePerKm: number;
};


panNumber: string;
gstNumber: string;
fssaiNumber: string;
upiHandle: string;
accountHolderName: string;
bankAccountNumber: string;
bankIfscCode: string;


termsAccepted: boolean;
privacyAccepted: boolean;
signatureImage: string | null;
}