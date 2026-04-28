

export type OnboardingStep =
  | 'phone_verification'
  | 'basic_profile'
  | 'business_details'
  | 'delivery_service'
  | 'operations'
  | 'kyc_bank'
  | 'documents_kyc'
  | 'agreement'
  | 'completion';


// ServiceArea type (from ServiceAreas component)
export interface ServiceArea {
  pincode: string;
  city: string;
  state: string;
}

// DeliverySettings type (from ServiceAreas component)
export interface DeliverySettings {
  freeDeliveryRadius: number | null;
  maxDeliveryDistance: number | null;
  extraChargePerKm: number | null;
}

export interface KYCFormData {
  panNumber: string;
  gstNumber: string;
  fssaiNumber: string;
  upiHandle: string;
  accountHolderName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
}

// Full Onboarding Form Data
export interface OnboardingFormData {
  email: string;
  phone: string;
  otp: string;

  fullName: string;
  partnerType: 'individual' | 'business' | null;
  businessName: string;
  businessType: string[];
  eventsHandled: string[];


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
  serviceAreas: ServiceArea[];
  deliverySettings: DeliverySettings;

  // Step 5: KYC & Payments
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

export type DistanceUnit = 'km' | 'mile';

export interface StepComponentProps<TInitialData, TSubmitData = TInitialData> {
  initialData: TInitialData;
  isLoading?: boolean;
  error?: string;
  onSubmitForm: (data: TSubmitData) => void | Promise<void>;
  onBack?: () => void;
}

export interface AuthVerificationData {
  email?: string;
  phone?: string;
}


export interface ServiceAreaInput {
  id?: string;
  pincode: string;
  cityId: string;
  countryCode?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface DeliveryServiceData {
  canServeEntireCity: boolean;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  freeDeliveryRadius: number | null;
  maxDeliveryDistance: number | null;
  distanceUnit: 'km' | 'mile';
  extraChargePerDistanceUnit: number | null;
  minOrderValue: number | null;
  serviceAreas: ServiceAreaInput[];
}

export interface BasicProfileData {
  partnerType: 'individual' | 'business';
  contactName: string;
  businessName?: string | null;
  businessDescription?: string | null;
  countryCode: string;
  baseCityId: string;
  kitchenAddress: string;
  latitude?: number | null;
  longitude?: number | null;
  capacityRangeId: string;
}

export interface BusinessDetailsData {
  businessTypeIds: string[];
  cuisineIds: string[];
  eventTypeIds: string[];
  dietTypeIds: string[];
  serviceStyleIds: string[];
}


export interface OperationsData {
  advanceNoticeHours: number;
  minPrepTimeHours: number;
  autoAcceptOrders: boolean;
  allowsCustomOrders: boolean;
  cancellationPolicy?: string | null;
  refundPolicy?: string | null;
}

export interface KycBankData {
  panNumber?: string | null;
  gstNumber?: string | null;
  fssaiNumber?: string | null;
  accountHolderName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
  upiHandle?: string | null;
}

export interface AgreementData {
  agreementVersionId: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  signatureImage: string | null;
  otpVerified: boolean;
  signedDocumentUrl?: string | null;
  acceptedAt?: string | null;
}

export interface PartnerOnboardingPayload {
  profile: BasicProfileData;
  business: BusinessDetailsData;
  delivery: DeliveryServiceData;
  operations: OperationsData;
  kycBank: KycBankData;
  agreement?: AgreementData;
}
