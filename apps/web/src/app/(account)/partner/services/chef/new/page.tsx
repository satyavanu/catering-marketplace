'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ServicesIcon,
  CalendarIcon,
  ApprovalIcon,
  RejectIcon,
} from '@/components/Icons/DashboardIcons';
import StatusBadge from '@/components/dashboard/StatusBadge';
import {
  type City,
  type Country,
  type PartnerServicePayload,
  type ServiceArea,
  useCreatePartnerService,
  useSubmitPartnerService,
} from '@catering-marketplace/query-client';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';

type FoodType = 'veg' | 'non_veg' | 'both';
type ServiceLocation = 'customer_home' | 'my_kitchen' | 'both';
type ChefPricingMode =
  | 'per_meal'
  | 'per_person'
  | 'per_hour'
  | 'per_session'
  | 'custom_quote';

type ChefProfile = {
  name: string;
  avatarUrl: string;
  experience: string;
  cuisines: string[];
  city: string;
};

type ChefExperienceSection = {
  id: string;
  title: string;
  items: string[];
  note: string;
};

type ChefServiceForm = {
  title: string;
  description: string;
  experienceTypeKey: string;
  cuisines: string[];
  dietTypes: string[];
  serviceStyles: string[];
  foodType: FoodType;
  serviceType: ServiceLocation;
  days: string[];
  slots: string[];
  pricingMode: ChefPricingMode;
  pricePerMeal: string;
  minPeople: string;
  maxPeople: string;
  currencyCode: string;
  cityId: string;
  city: string;
  areas: string[];
  radiusKm: number;
  images: string[];
  experienceSections: ChefExperienceSection[];
};

const DEFAULT_PROFILE: ChefProfile = {
  name: 'Your chef profile',
  avatarUrl: '',
  experience: 'Professional chef',
  cuisines: ['Custom menu'],
  city: 'Your city',
};

const DEFAULT_FORM: ChefServiceForm = {
  title: 'Home Chef for Daily Meals',
  description:
    'Fresh, hygienic home-style meals prepared with care for families, professionals, and elderly customers.',
  experienceTypeKey: 'private_dining',
  cuisines: ['north_indian', 'south_indian'],
  dietTypes: ['vegetarian'],
  serviceStyles: ['on_site_cooking'],
  foodType: 'veg',
  serviceType: 'customer_home',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  slots: ['Lunch', 'Dinner'],
  pricingMode: 'per_meal',
  pricePerMeal: '250',
  minPeople: '',
  maxPeople: '',
  currencyCode: 'INR',
  cityId: '',
  city: 'Hyderabad',
  areas: ['Jubilee Hills', 'Madhapur', 'Kondapur'],
  radiusKm: 12,
  images: [],
  experienceSections: [],
};

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const slots = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'];

const pricingModeOptions: {
  key: ChefPricingMode;
  label: string;
  description: string;
  amountLabel: string;
  placeholder: string;
}[] = [
  {
    key: 'per_meal',
    label: 'Per meal',
    description: 'Best for daily meals or tiffin-style chef services.',
    amountLabel: 'Price per meal',
    placeholder: '250',
  },
  {
    key: 'per_person',
    label: 'Per person',
    description: 'Best for private dining, parties, and plated experiences.',
    amountLabel: 'Price per person',
    placeholder: '1200',
  },
  {
    key: 'per_hour',
    label: 'Per hour',
    description: 'Best for chef hire, live cooking, or prep support.',
    amountLabel: 'Hourly rate',
    placeholder: '900',
  },
  {
    key: 'per_session',
    label: 'Per session',
    description: 'Best for fixed chef visits or hosted experiences.',
    amountLabel: 'Session price',
    placeholder: '5000',
  },
  {
    key: 'custom_quote',
    label: 'Custom quote',
    description: 'Collect requirements first and quote after discussion.',
    amountLabel: 'Starting price',
    placeholder: 'Optional',
  },
];

const fallbackCuisineOptions = [
  { key: 'north_indian', label: 'North Indian' },
  { key: 'south_indian', label: 'South Indian' },
  { key: 'jain_food', label: 'Jain Food' },
  { key: 'hyderabadi', label: 'Hyderabadi' },
];

const fallbackDietTypeOptions = [
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'non_vegetarian', label: 'Non-Vegetarian' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'jain', label: 'Jain Food' },
];

const fallbackServiceStyleOptions = [
  { key: 'on_site_cooking', label: 'On-site Cooking' },
  { key: 'delivery_only', label: 'Delivery Only' },
  { key: 'pickup', label: 'Pickup Available' },
];

function getAllCities(locations?: {
  countries: { states: { cities: City[] }[] }[];
}) {
  return (
    locations?.countries.flatMap((country) =>
      country.states.flatMap((state) => state.cities)
    ) || []
  );
}

function getSupportedCurrencies(locations?: { countries: Country[] }) {
  const byCode = new Map<
    string,
    { code: string; symbol: string; label: string }
  >();

  locations?.countries.forEach((country) => {
    if (!isValidCurrencyCode(country.currencyCode)) return;

    byCode.set(country.currencyCode, {
      code: country.currencyCode,
      symbol: country.currencySymbol || country.currencyCode,
      label: `${country.currencyCode} (${country.currencySymbol || country.name})`,
    });
  });

  return Array.from(byCode.values()).sort((a, b) =>
    a.code.localeCompare(b.code)
  );
}

function isValidCurrencyCode(value: string) {
  return /^[A-Z]{3}$/.test(value.trim());
}

function findCountryByCity(
  locations: { countries: Country[] } | undefined,
  cityId: string,
  cityName: string
) {
  for (const country of locations?.countries || []) {
    for (const state of country.states || []) {
      const matchedCity = state.cities?.find(
        (city) => city.id === cityId || city.name === cityName
      );

      if (matchedCity) return country;
    }
  }

  return undefined;
}

function getCurrencySymbol(
  currencyCode: string,
  currencies: { code: string; symbol: string }[]
) {
  return (
    currencies.find((currency) => currency.code === currencyCode)?.symbol ||
    currencyCode
  );
}

function getSessionCountryCode(sessionUser: unknown) {
  const user = sessionUser as
    | {
        countryCode?: string;
        country_code?: string;
        partner?: { countryCode?: string; country_code?: string } | null;
      }
    | undefined;

  return (
    user?.countryCode ||
    user?.country_code ||
    user?.partner?.countryCode ||
    user?.partner?.country_code ||
    ''
  );
}

function buildProfileFromSession(
  profile: ChefProfile,
  sessionUser: unknown,
  form: ChefServiceForm,
  cuisineOptions: { key: string; label: string }[]
): ChefProfile {
  const user = sessionUser as
    | {
        name?: string | null;
        fullName?: string | null;
        image?: string | null;
      }
    | undefined;
  const cuisineLabelByKey = new Map(
    cuisineOptions.map((item) => [item.key, item.label])
  );

  return {
    name: user?.fullName || user?.name || profile.name,
    avatarUrl: user?.image || profile.avatarUrl,
    experience: profile.experience,
    cuisines:
      form.cuisines.length > 0
        ? form.cuisines
            .slice(0, 3)
            .map((item) => cuisineLabelByKey.get(item) || item)
        : profile.cuisines,
    city: form.city || profile.city,
  };
}

function normalizeExperienceSections(sections: ChefExperienceSection[]) {
  return sections
    .map((section, index) => ({
      key: section.id || `section-${index + 1}`,
      title: section.title.trim(),
      items: section.items.map((item) => item.trim()).filter(Boolean),
      note: section.note.trim() || null,
      sort_order: index,
    }))
    .filter((section) => section.title && section.items.length > 0);
}

function isHostedExperience(experienceKey: string, experienceLabel = '') {
  const value = `${experienceKey} ${experienceLabel}`.toLowerCase();

  return ['fine', 'rooftop', 'venue', 'hosted', 'pop_up', 'pop-up'].some(
    (token) => value.includes(token)
  );
}

function getPricingModeOption(pricingMode: ChefPricingMode) {
  return (
    pricingModeOptions.find((option) => option.key === pricingMode) ||
    pricingModeOptions[0]
  );
}

function mapPricingModel(pricingMode: ChefPricingMode) {
  if (pricingMode === 'per_person') return 'per_person';
  if (pricingMode === 'per_meal') return 'per_plate';
  if (pricingMode === 'per_session') return 'per_event';
  if (pricingMode === 'custom_quote') return 'custom_quote';
  return 'custom_quote';
}

function formatPricingUnit(pricingMode: ChefPricingMode) {
  if (pricingMode === 'per_person') return 'person';
  if (pricingMode === 'per_hour') return 'hour';
  if (pricingMode === 'per_session') return 'session';
  if (pricingMode === 'custom_quote') return 'quote';
  return 'meal';
}

function parseMoney(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildCreateChefPayload(
  form: ChefServiceForm,
  serviceAreaOptions: ServiceArea[],
  serviceAreasRequired: boolean
): PartnerServicePayload {
  const basePrice = parseMoney(form.pricePerMeal);
  const minPeople = form.minPeople ? Number(form.minPeople) : null;
  const maxPeople = form.maxPeople ? Number(form.maxPeople) : null;
  const selectedServiceAreas = serviceAreasRequired
    ? form.areas.map((areaName) => {
        const matchedArea = serviceAreaOptions.find(
          (area) => area.name === areaName
        );

        return {
          city_id: form.cityId || null,
          city: form.city,
          service_area_id: matchedArea?.id || null,
          area: areaName,
          postal_code: matchedArea?.postalCode || null,
          latitude: matchedArea?.latitude || null,
          longitude: matchedArea?.longitude || null,
          radius_km: matchedArea?.radiusKm || form.radiusKm,
        };
      })
    : [];

  return {
    service_key: 'chef',
    experience_type_key: form.experienceTypeKey,
    title: form.title.trim(),
    short_description: form.description.trim(),
    description: form.description.trim(),
    booking_type: 'instant',
    pricing_model: mapPricingModel(form.pricingMode),
    base_price: basePrice,
    currency_code: form.currencyCode,
    min_guests: minPeople,
    max_guests: maxPeople,
    advance_notice_hours: 24,
    service_areas: selectedServiceAreas,
    media: form.images.map((url, index) => ({
      url,
      type: index === 0 ? 'cover' : 'gallery',
      sort_order: index,
    })),
    attributes: {
      cuisines: form.cuisines,
      diet_types: form.dietTypes,
      service_styles: form.serviceStyles,
      food_type: form.foodType,
      service_location: form.serviceType,
      availability: {
        days: form.days,
        slots: form.slots,
      },
      pricing: {
        currency_code: form.currencyCode,
        mode: form.pricingMode,
        unit: formatPricingUnit(form.pricingMode),
        amount: basePrice,
        price_per_meal: form.pricingMode === 'per_meal' ? basePrice : null,
        price_per_person: form.pricingMode === 'per_person' ? basePrice : null,
        hourly_rate: form.pricingMode === 'per_hour' ? basePrice : null,
        session_price: form.pricingMode === 'per_session' ? basePrice : null,
        min_people: minPeople,
        max_people: maxPeople,
      },
      chef_experience: {
        sections: normalizeExperienceSections(form.experienceSections),
      },
      city: form.city,
      city_id: form.cityId || null,
      location_model: serviceAreasRequired ? 'service_area' : 'hosted_location',
      service_radius_km: form.radiusKm,
      includes: ['cooking'],
      menu_style: 'customizable',
      occasion_tags: [],
    },
    is_active: true,
  };
}

export default function CreateChefServicePage({
  profile = DEFAULT_PROFILE,
  onBack,
  onSubmit,
}: {
  profile?: ChefProfile;
  onBack?: () => void;
  onSubmit?: (payload: PartnerServicePayload) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { masterData, locations } = useOnboardingMasterDataContext();
  const { getExperienceTypesForService } = useServiceCatalogMetaContext();
  const [form, setForm] = useState<ChefServiceForm>(DEFAULT_FORM);
  const [areaInput, setAreaInput] = useState('');
  const [submitError, setSubmitError] = useState('');

  const createServiceMutation = useCreatePartnerService();
  const submitServiceMutation = useSubmitPartnerService();
  const isSubmitting =
    createServiceMutation.isPending || submitServiceMutation.isPending;
  const chefExperienceTypes = useMemo(
    () => getExperienceTypesForService('chef').filter((item) => item.is_active),
    [getExperienceTypesForService]
  );
  const cuisineOptions = masterData?.cuisines || fallbackCuisineOptions;
  const dietTypeOptions = masterData?.diet_types || fallbackDietTypeOptions;
  const serviceStyleOptions =
    masterData?.service_styles || fallbackServiceStyleOptions;
  const cityOptions = useMemo(() => getAllCities(locations), [locations]);
  const supportedCurrencies = useMemo(
    () => getSupportedCurrencies(locations),
    [locations]
  );
  const selectedCity = useMemo(
    () =>
      cityOptions.find((city) => city.id === form.cityId) ||
      cityOptions.find((city) => city.name === form.city),
    [cityOptions, form.city, form.cityId]
  );
  const selectedCountry = useMemo(
    () => findCountryByCity(locations, form.cityId, form.city),
    [form.city, form.cityId, locations]
  );
  const sessionCountryCode = getSessionCountryCode(session?.user);
  const sessionCountry = useMemo(
    () =>
      locations?.countries.find(
        (country) => country.code === sessionCountryCode
      ),
    [locations, sessionCountryCode]
  );
  const profileSnapshot = useMemo(
    () => buildProfileFromSession(profile, session?.user, form, cuisineOptions),
    [cuisineOptions, form, profile, session?.user]
  );
  const currencySymbol = getCurrencySymbol(
    form.currencyCode,
    supportedCurrencies
  );
  const serviceAreaOptions = selectedCity?.serviceAreas || [];
  const selectedExperienceLabel =
    chefExperienceTypes.find((item) => item.key === form.experienceTypeKey)
      ?.label || 'Private Dining';
  const serviceAreasRequired = !isHostedExperience(
    form.experienceTypeKey,
    selectedExperienceLabel
  );
  const selectedPricingMode = getPricingModeOption(form.pricingMode);

  useEffect(() => {
    const firstExperience = chefExperienceTypes[0];
    if (!firstExperience) return;

    const hasSelectedExperience = chefExperienceTypes.some(
      (item) => item.key === form.experienceTypeKey
    );

    if (!hasSelectedExperience) {
      setForm((prev) => ({
        ...prev,
        experienceTypeKey: firstExperience.key,
      }));
    }
  }, [chefExperienceTypes, form.experienceTypeKey]);

  useEffect(() => {
    if (form.cityId || cityOptions.length === 0) return;

    const defaultCity =
      cityOptions.find((city) => city.name === form.city) || cityOptions[0];

    setForm((prev) => ({
      ...prev,
      cityId: defaultCity.id,
      city: defaultCity.name,
      currencyCode:
        findCountryByCity(locations, defaultCity.id, defaultCity.name)
          ?.currencyCode || prev.currencyCode,
    }));
  }, [cityOptions, form.city, form.cityId, locations]);

  useEffect(() => {
    const nextCurrency =
      selectedCountry?.currencyCode ||
      sessionCountry?.currencyCode ||
      supportedCurrencies[0]?.code ||
      DEFAULT_FORM.currencyCode;

    if (nextCurrency && !isValidCurrencyCode(form.currencyCode)) {
      setForm((prev) => ({
        ...prev,
        currencyCode: nextCurrency,
      }));
    }
  }, [
    form.currencyCode,
    selectedCountry?.currencyCode,
    sessionCountry?.currencyCode,
    supportedCurrencies,
  ]);

  const isValid = useMemo(() => {
    const currencyIsKnown =
      supportedCurrencies.length === 0 ||
      supportedCurrencies.some(
        (currency) => currency.code === form.currencyCode
      );

    return (
      form.title.trim() &&
      form.description.trim() &&
      form.experienceTypeKey &&
      form.cuisines.length > 0 &&
      form.dietTypes.length > 0 &&
      form.days.length > 0 &&
      form.slots.length > 0 &&
      (form.pricingMode === 'custom_quote' || form.pricePerMeal.trim()) &&
      isValidCurrencyCode(form.currencyCode) &&
      currencyIsKnown &&
      form.city.trim() &&
      (!serviceAreasRequired || form.areas.length > 0)
    );
  }, [form, serviceAreasRequired, supportedCurrencies]);

  const update = <K extends keyof ChefServiceForm>(
    key: K,
    value: ChefServiceForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = <K extends keyof ChefServiceForm>(
    key: K,
    value: string
  ) => {
    setForm((prev) => {
      const current = prev[key] as string[];

      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const removeImage = (image: string) => {
    update(
      'images',
      form.images.filter((item) => item !== image)
    );
  };

  const updateExperienceSection = (
    id: string,
    patch: Partial<ChefExperienceSection>
  ) => {
    update(
      'experienceSections',
      form.experienceSections.map((section) =>
        section.id === id ? { ...section, ...patch } : section
      )
    );
  };

  const addExperienceSection = () => {
    update('experienceSections', [
      ...form.experienceSections,
      {
        id: `section-${Date.now()}`,
        title: '',
        items: [''],
        note: '',
      },
    ]);
  };

  const removeExperienceSection = (id: string) => {
    update(
      'experienceSections',
      form.experienceSections.filter((section) => section.id !== id)
    );
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    if (!isValidCurrencyCode(form.currencyCode)) {
      setSubmitError('Use a valid 3-letter currency code such as INR or USD.');
      return;
    }

    const payload = buildCreateChefPayload(
      form,
      serviceAreaOptions,
      serviceAreasRequired
    );
    setSubmitError('');

    try {
      onSubmit?.(payload);
      const createdService = await createServiceMutation.mutateAsync(payload);
      await submitServiceMutation.mutateAsync(createdService.id);
      router.push('/partner/services');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to create chef service. Please try again.'
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <StatusBadge status="under_review" label="Draft Service" />
      </div>

      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <ServicesIcon size={25} />
        </div>

        <div>
          <h1 style={styles.title}>Create Chef Service</h1>
          <p style={styles.subtitle}>
            Build a chef service listing using your profile, availability,
            pricing, service area, and food photos.
          </p>
        </div>
      </div>

      <div style={styles.layout}>
        <main style={styles.left}>
          <ProfileSnapshot
            profile={profileSnapshot}
            onUploadAvatar={(file) => console.log('upload avatar', file)}
          />

          <Section
            title="Basic service details"
            subtitle="Tell customers what this chef service is about."
          >
            <div style={styles.grid2}>
              <Field label="Service title" required>
                <input
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  style={styles.input}
                  placeholder="Example: Home Chef for Daily Meals"
                />
              </Field>

              <Field label="City" required>
                <CitySelect
                  value={form.cityId}
                  fallbackCity={form.city}
                  cityOptions={cityOptions}
                  onChange={(nextCity) => {
                    const nextCountry = findCountryByCity(
                      locations,
                      nextCity?.id || '',
                      nextCity?.name || ''
                    );
                    setForm((prev) => ({
                      ...prev,
                      cityId: nextCity?.id || '',
                      city: nextCity?.name || prev.city,
                      currencyCode:
                        nextCountry?.currencyCode || prev.currencyCode,
                      areas: [],
                    }));
                  }}
                />
              </Field>
            </div>

            <Field label="Short description" required>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={4}
                maxLength={180}
                style={styles.textarea}
                placeholder="Describe your service in simple words."
              />
              <p style={styles.helper}>{form.description.length}/180</p>
            </Field>

            <div style={styles.block}>
              <Label required>Cuisines</Label>
              <ChipGrid>
                {cuisineOptions.map((item) => (
                  <Chip
                    key={item.key}
                    label={item.label}
                    selected={form.cuisines.includes(item.key)}
                    onClick={() => toggleArray('cuisines', item.key)}
                  />
                ))}
              </ChipGrid>
            </div>
          </Section>

          <Section
            title="Service configuration"
            subtitle="Choose food preference and where you provide the service."
          >
            <Field label="Experience type" required>
              <SelectWrap>
                <select
                  value={form.experienceTypeKey}
                  onChange={(e) => update('experienceTypeKey', e.target.value)}
                  style={styles.select}
                >
                  {chefExperienceTypes.length === 0 && (
                    <option value="private_dining">Private Dining</option>
                  )}
                  {chefExperienceTypes.map((experienceType) => (
                    <option key={experienceType.key} value={experienceType.key}>
                      {experienceType.label}
                    </option>
                  ))}
                </select>
              </SelectWrap>
              <p style={styles.helper}>
                {serviceAreasRequired
                  ? 'Customers will book this chef service from selected service areas.'
                  : 'This experience is tied to a hosted location, so service areas are optional.'}
              </p>
            </Field>

            <div style={styles.block}>
              <Label required>Food preference</Label>
              <ChipGrid>
                <Chip
                  label="Veg"
                  selected={form.foodType === 'veg'}
                  onClick={() => update('foodType', 'veg')}
                />
                <Chip
                  label="Non-Veg"
                  selected={form.foodType === 'non_veg'}
                  onClick={() => update('foodType', 'non_veg')}
                />
                <Chip
                  label="Both"
                  selected={form.foodType === 'both'}
                  onClick={() => update('foodType', 'both')}
                />
              </ChipGrid>
            </div>

            <div style={styles.block}>
              <Label required>Diet tags</Label>
              <ChipGrid>
                {dietTypeOptions.map((item) => (
                  <Chip
                    key={item.key}
                    label={item.label}
                    selected={form.dietTypes.includes(item.key)}
                    onClick={() => toggleArray('dietTypes', item.key)}
                  />
                ))}
              </ChipGrid>
            </div>

            <div style={styles.block}>
              <Label>Service styles</Label>
              <ChipGrid>
                {serviceStyleOptions.map((item) => (
                  <Chip
                    key={item.key}
                    label={item.label}
                    selected={form.serviceStyles.includes(item.key)}
                    onClick={() => toggleArray('serviceStyles', item.key)}
                  />
                ))}
              </ChipGrid>
            </div>

            <div style={styles.optionGrid}>
              <OptionCard
                icon={<ServicesIcon size={18} />}
                title="At customer’s home"
                text="Cook at the customer’s location."
                selected={form.serviceType === 'customer_home'}
                onClick={() => update('serviceType', 'customer_home')}
              />
              <OptionCard
                icon={<CalendarIcon size={18} />}
                title="At my kitchen"
                text="Prepare from your kitchen or pickup point."
                selected={form.serviceType === 'my_kitchen'}
                onClick={() => update('serviceType', 'my_kitchen')}
              />
              <OptionCard
                icon={<ApprovalIcon size={18} />}
                title="Both"
                text="Support both customer home and kitchen service."
                selected={form.serviceType === 'both'}
                onClick={() => update('serviceType', 'both')}
              />
            </div>
          </Section>

          <Section
            title="Availability"
            subtitle="Select when customers can book this chef service."
          >
            <div style={styles.block}>
              <Label required>Available days</Label>
              <ChipGrid>
                {days.map((day) => (
                  <Chip
                    key={day}
                    label={day}
                    selected={form.days.includes(day)}
                    onClick={() => toggleArray('days', day)}
                  />
                ))}
              </ChipGrid>
            </div>

            <div style={styles.block}>
              <Label required>Available slots</Label>
              <div style={styles.optionGrid}>
                {slots.map((slot) => (
                  <OptionCard
                    key={slot}
                    icon={<CalendarIcon size={17} />}
                    title={slot}
                    text={getSlotTiming(slot)}
                    selected={form.slots.includes(slot)}
                    onClick={() => toggleArray('slots', slot)}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section
            title="Chef experience menu"
            subtitle="Add menu sections only when this service needs a visible course or item outline."
          >
            {form.experienceSections.length === 0 ? (
              <div style={styles.emptyState}>
                <strong>No menu sections added yet</strong>
                <span>
                  Keep this empty for hourly chef hire or add sections for fine
                  dining, tastings, and set menus.
                </span>
              </div>
            ) : (
              <div style={styles.experienceSectionList}>
                {form.experienceSections.map((section, index) => (
                  <div key={section.id} style={styles.experienceSectionCard}>
                    <div style={styles.experienceSectionHeader}>
                      <strong style={styles.experienceSectionTitle}>
                        Section {index + 1}
                      </strong>
                      <button
                        type="button"
                        style={styles.textButton}
                        onClick={() => removeExperienceSection(section.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div style={styles.grid2}>
                      <Field label="Section name" required>
                        <input
                          value={section.title}
                          onChange={(e) =>
                            updateExperienceSection(section.id, {
                              title: e.target.value,
                            })
                          }
                          style={styles.input}
                          placeholder="Example: Starters, Mains, Live counter"
                        />
                      </Field>

                      <Field label="Chef note">
                        <input
                          value={section.note}
                          onChange={(e) =>
                            updateExperienceSection(section.id, {
                              note: e.target.value,
                            })
                          }
                          style={styles.input}
                          placeholder="Example: Seasonal items may vary"
                        />
                      </Field>
                    </div>

                    <Field label="Included items" required>
                      <textarea
                        value={section.items.join('\n')}
                        onChange={(e) =>
                          updateExperienceSection(section.id, {
                            items: e.target.value.split('\n'),
                          })
                        }
                        rows={4}
                        style={styles.textarea}
                        placeholder={'Signature starter\nSoup or salad'}
                      />
                      <p style={styles.helper}>Add one item per line.</p>
                    </Field>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              style={styles.inlineAddButton}
              onClick={addExperienceSection}
            >
              Add section
            </button>
          </Section>

          <Section
            title="Pricing"
            subtitle="Choose how customers should understand your price."
          >
            <div style={styles.block}>
              <Label required>Pricing model</Label>
              <div style={styles.optionGrid}>
                {pricingModeOptions.map((option) => (
                  <OptionCard
                    key={option.key}
                    icon={<ApprovalIcon size={17} />}
                    title={option.label}
                    text={option.description}
                    selected={form.pricingMode === option.key}
                    onClick={() => update('pricingMode', option.key)}
                  />
                ))}
              </div>
            </div>

            <div style={styles.grid2}>
              <Field label="Currency" required>
                {supportedCurrencies.length > 0 ? (
                  <SelectWrap>
                    <select
                      value={form.currencyCode}
                      onChange={(e) => update('currencyCode', e.target.value)}
                      style={styles.select}
                    >
                      {supportedCurrencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                ) : (
                  <input
                    value={form.currencyCode}
                    onChange={(e) =>
                      update('currencyCode', e.target.value.toUpperCase())
                    }
                    style={styles.input}
                    maxLength={3}
                    placeholder="INR"
                  />
                )}
              </Field>

              <Field
                label={selectedPricingMode.amountLabel}
                required={form.pricingMode !== 'custom_quote'}
              >
                <input
                  value={form.pricePerMeal}
                  onChange={(e) => update('pricePerMeal', e.target.value)}
                  style={styles.input}
                  placeholder={selectedPricingMode.placeholder}
                />
              </Field>

              <Field label="Minimum people">
                <input
                  type="number"
                  value={form.minPeople}
                  onChange={(e) => update('minPeople', e.target.value)}
                  style={styles.input}
                  min={1}
                  placeholder="Optional"
                />
              </Field>

              <Field label="Maximum people">
                <input
                  type="number"
                  value={form.maxPeople}
                  onChange={(e) => update('maxPeople', e.target.value)}
                  style={styles.input}
                  min={1}
                  placeholder="Optional"
                />
              </Field>
            </div>
            <p style={styles.helper}>
              {form.pricingMode === 'custom_quote'
                ? `Customers will see pricing as custom quote in ${form.currencyCode}.`
                : `Customers will see ${currencySymbol}${form.pricePerMeal || selectedPricingMode.placeholder} per ${formatPricingUnit(form.pricingMode)}.`}
            </p>
          </Section>

          <Section
            title="Service area"
            subtitle="Choose areas where customers can book this service."
          >
            <div style={styles.grid2}>
              <Field label="City" required>
                <CitySelect
                  value={form.cityId}
                  fallbackCity={form.city}
                  cityOptions={cityOptions}
                  onChange={(nextCity) => {
                    const nextCountry = findCountryByCity(
                      locations,
                      nextCity?.id || '',
                      nextCity?.name || ''
                    );
                    setForm((prev) => ({
                      ...prev,
                      cityId: nextCity?.id || '',
                      city: nextCity?.name || prev.city,
                      currencyCode:
                        nextCountry?.currencyCode || prev.currencyCode,
                      areas: serviceAreasRequired ? [] : prev.areas,
                    }));
                  }}
                />
              </Field>

              {serviceAreasRequired ? (
                <Field label="Add custom area">
                  <div style={styles.inlineInput}>
                    <input
                      value={areaInput}
                      onChange={(e) => setAreaInput(e.target.value)}
                      style={styles.input}
                      placeholder="Example: Kukatpally"
                    />

                    <button
                      type="button"
                      style={styles.inlineAddButton}
                      onClick={() => {
                        const value = areaInput.trim();
                        if (!value) return;
                        if (!form.areas.includes(value)) {
                          update('areas', [...form.areas, value]);
                        }
                        setAreaInput('');
                      }}
                    >
                      Add
                    </button>
                  </div>
                </Field>
              ) : (
                <div style={styles.locationNote}>
                  <strong>Hosted location</strong>
                  <span>
                    Add the exact venue/address later in service details or
                    booking setup. Area chips are not required for this
                    experience type.
                  </span>
                </div>
              )}
            </div>

            {serviceAreasRequired && (
              <div style={styles.block}>
                <Label required>Selected service areas</Label>

                <ChipGrid>
                  {[
                    ...new Set([
                      ...serviceAreaOptions.map((area) => area.name),
                      ...form.areas,
                    ]),
                  ].map((area) => (
                    <Chip
                      key={area}
                      label={area}
                      selected={form.areas.includes(area)}
                      onClick={() => toggleArray('areas', area)}
                    />
                  ))}
                </ChipGrid>

                <p style={styles.helper}>
                  Select at least one area. You can add more areas manually.
                </p>
              </div>
            )}
          </Section>

          <Section
            title="Service images"
            subtitle="Image upload will be connected next. This form no longer submits sample images."
          >
            <ServiceImageGallery images={form.images} onRemove={removeImage} />
          </Section>

          <div style={styles.actions}>
            <button type="button" onClick={onBack} style={styles.secondaryBtn}>
              Cancel
            </button>

            <button
              type="button"
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit}
              style={{
                ...styles.primaryBtn,
                ...(!isValid || isSubmitting ? styles.disabledBtn : {}),
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review →'}
            </button>
          </div>

          {submitError && <p style={styles.errorText}>{submitError}</p>}
        </main>

        <aside style={styles.right}>
          <ChefServicePreview
            profile={profileSnapshot}
            form={form}
            cuisineOptions={cuisineOptions}
            currencySymbol={currencySymbol}
            experienceLabel={selectedExperienceLabel}
            serviceAreasRequired={serviceAreasRequired}
          />
        </aside>
      </div>
    </div>
  );
}

function ChefServicePreview({
  profile,
  form,
  cuisineOptions,
  experienceLabel,
  currencySymbol,
  serviceAreasRequired,
}: {
  profile: ChefProfile;
  form: ChefServiceForm;
  cuisineOptions: { key: string; label: string }[];
  experienceLabel: string;
  currencySymbol: string;
  serviceAreasRequired: boolean;
}) {
  const cuisineLabelByKey = new Map(
    cuisineOptions.map((item) => [item.key, item.label])
  );

  return (
    <div style={styles.preview}>
      <div style={styles.previewHeader}>
        <span>Live preview</span>
        <StatusBadge status="under_review" label="Draft" />
      </div>

      <div style={styles.previewCover}>
        {form.images[0] ? (
          <img
            src={form.images[0]}
            alt={form.title}
            style={styles.previewCoverImg}
          />
        ) : (
          <div style={styles.previewCoverPlaceholder}>No service photo yet</div>
        )}
      </div>

      <div style={styles.previewBody}>
        <div style={styles.previewProfile}>
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              style={styles.previewAvatar}
            />
          ) : (
            <div style={styles.previewAvatarFallback}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 style={styles.previewTitle}>
              {form.title || 'Chef Service Title'}
            </h2>
            <p style={styles.previewSub}>By {profile.name}</p>
          </div>
        </div>

        <p style={styles.previewDesc}>{form.description}</p>

        <div style={styles.previewTags}>
          {form.cuisines.slice(0, 4).map((item) => (
            <span key={item} style={styles.previewTag}>
              {cuisineLabelByKey.get(item) || item}
            </span>
          ))}
        </div>

        <div style={styles.previewInfo}>
          <PreviewRow label="Experience" value={experienceLabel} />
          <PreviewRow label="Food type" value={formatFoodType(form.foodType)} />
          <PreviewRow
            label="Service"
            value={formatServiceType(form.serviceType)}
          />
          <PreviewRow
            label="Availability"
            value={`${form.days.length} days · ${form.slots.join(', ')}`}
          />
          <PreviewRow
            label="Pricing"
            value={formatPricingPreview(
              form.pricingMode,
              form.pricePerMeal,
              currencySymbol
            )}
          />
          <PreviewRow
            label="Menu"
            value={`${normalizeExperienceSections(form.experienceSections).length} sections`}
          />
          <PreviewRow
            label={serviceAreasRequired ? 'Area' : 'Location'}
            value={
              serviceAreasRequired
                ? `${form.areas.length} selected · ${form.city}`
                : `Hosted in ${form.city}`
            }
          />
        </div>

        <div style={styles.previewNote}>
          <ApprovalIcon size={16} />
          Goes live after Droooly approval.
        </div>
      </div>
    </div>
  );
}

function ServiceImageGallery({
  images,
  onRemove,
}: {
  images: string[];
  onRemove: (image: string) => void;
}) {
  return (
    <div>
      <div style={styles.imageGrid}>
        {images.map((image, index) => (
          <div key={`${image}-${index}`} style={styles.imageTile}>
            <img src={image} alt="Service" style={styles.image} />
            <button
              type="button"
              onClick={() => onRemove(image)}
              style={styles.removeImageBtn}
            >
              <RejectIcon size={13} />
            </button>
          </div>
        ))}

        {images.length === 0 && (
          <div style={styles.imageUploadPending}>
            <strong>Image upload coming next</strong>
            <small>
              No service photos added yet. We can connect S3 upload before
              enabling photo submission.
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {subtitle && <p style={styles.sectionSub}>{subtitle}</p>}
      </div>
      <div style={styles.sectionBody}>{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={styles.field}>
      <Label required={required}>{label}</Label>
      {children}
    </label>
  );
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.selectWrap}>
      {children}
      <span aria-hidden="true" style={styles.selectChevron}>
        v
      </span>
    </div>
  );
}

function CitySelect({
  value,
  fallbackCity,
  cityOptions,
  onChange,
}: {
  value: string;
  fallbackCity: string;
  cityOptions: City[];
  onChange: (city: City | undefined) => void;
}) {
  return (
    <SelectWrap>
      <select
        value={value}
        onChange={(event) =>
          onChange(cityOptions.find((city) => city.id === event.target.value))
        }
        style={styles.select}
      >
        {cityOptions.length === 0 && (
          <option value={value}>{fallbackCity}</option>
        )}
        {cityOptions.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
    </SelectWrap>
  );
}

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span style={styles.label}>
      {children} {required && <span style={styles.required}>*</span>}
    </span>
  );
}

function ChipGrid({ children }: { children: React.ReactNode }) {
  return <div style={styles.chipGrid}>{children}</div>;
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.chip,
        ...(selected ? styles.chipSelected : {}),
      }}
    >
      {label}
      {selected && <span>✓</span>}
    </button>
  );
}

function OptionCard({
  icon,
  title,
  text,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.optionCard,
        ...(selected ? styles.optionSelected : {}),
      }}
    >
      <span style={styles.optionIcon}>{icon}</span>
      <strong>{title}</strong>
      <small>{text}</small>
    </button>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.previewRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getSlotTiming(slot: string) {
  if (slot === 'Breakfast') return '06:00 AM - 10:00 AM';
  if (slot === 'Lunch') return '11:00 AM - 03:00 PM';
  if (slot === 'Dinner') return '06:00 PM - 10:30 PM';
  return '04:00 PM - 07:00 PM';
}

function formatFoodType(value: FoodType) {
  if (value === 'veg') return 'Veg';
  if (value === 'non_veg') return 'Non-Veg';
  return 'Veg & Non-Veg';
}

function formatServiceType(value: ServiceLocation) {
  if (value === 'customer_home') return "Customer's home";
  if (value === 'my_kitchen') return 'My kitchen';
  return 'Home or kitchen';
}

function formatPricingPreview(
  pricingMode: ChefPricingMode,
  amount: string,
  currencySymbol: string
) {
  if (pricingMode === 'custom_quote') return 'Custom quote';

  const suffix = formatPricingUnit(pricingMode);
  return `${currencySymbol}${amount || '0'} / ${suffix}`;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },

  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backButton: {
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 24px rgba(124, 58, 237, 0.16)',
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize: 25,
    fontWeight: 700,
    color: '#151126',
    letterSpacing: '-0.03em',
  },

  subtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    lineHeight: 1.45,
    color: '#64748b',
  },

  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 360px',
    gap: 22,
    alignItems: 'start',
  },

  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
  },

  right: {
    position: 'sticky',
    top: 18,
  },

  profileCard: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 20,
    padding: 16,
    boxShadow: '0 8px 24px rgba(17, 24, 39, 0.035)',
  },

  profileImg: {
    width: 64,
    height: 64,
    borderRadius: 18,
    objectFit: 'cover',
    flexShrink: 0,
  },

  profileTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },

  profileName: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: '#151126',
  },

  profileMeta: {
    margin: '4px 0 9px',
    color: '#64748b',
    fontSize: 13,
  },

  editProfileBtn: {
    border: '1px solid #eee9f7',
    background: '#ffffff',
    color: '#7c3aed',
    borderRadius: 12,
    height: 34,
    padding: '0 11px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },

  miniTags: {
    display: 'flex',
    gap: 7,
    flexWrap: 'wrap',
  },

  miniTag: {
    padding: '5px 9px',
    borderRadius: 999,
    background: '#f3e8ff',
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: 600,
  },

  section: {
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 20,
    boxShadow: '0 8px 24px rgba(17, 24, 39, 0.035)',
    overflow: 'hidden',
  },

  sectionHeader: {
    padding: '16px 18px',
    borderBottom: '1px solid #f5f1fb',
  },

  sectionTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: '#151126',
  },

  sectionSub: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.45,
  },

  sectionBody: {
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: 14,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
  },

  required: {
    color: '#ff5a3d',
  },

  input: {
    width: '100%',
    height: 42,
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: '0 12px',
    outline: 'none',
    fontSize: 14,
    color: '#151126',
    background: '#ffffff',
  },

  selectWrap: {
    position: 'relative',
    width: '100%',
  },

  select: {
    width: '100%',
    height: 44,
    border: '1px solid #d8dee8',
    borderRadius: 12,
    padding: '0 38px 0 12px',
    outline: 'none',
    fontSize: 14,
    color: '#151126',
    background: '#ffffff',
    appearance: 'none',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    cursor: 'pointer',
  },

  selectChevron: {
    position: 'absolute',
    right: 13,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    pointerEvents: 'none',
    fontSize: 13,
    lineHeight: 1,
  },

  textarea: {
    width: '100%',
    minHeight: 96,
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 12,
    outline: 'none',
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#151126',
    resize: 'vertical',
  },

  helper: {
    margin: 0,
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 1.45,
  },

  block: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },

  experienceSectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  experienceSectionCard: {
    border: '1px solid #eee9f7',
    borderRadius: 16,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 13,
    background: '#fffdfd',
  },

  experienceSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  experienceSectionTitle: {
    color: '#151126',
    fontSize: 13,
  },

  locationNote: {
    border: '1px solid #e0f2fe',
    borderRadius: 14,
    background: '#f0f9ff',
    padding: 13,
    color: '#075985',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    fontSize: 12,
    lineHeight: 1.45,
  },

  emptyState: {
    border: '1px dashed #cbd5e1',
    borderRadius: 14,
    background: '#f8fafc',
    padding: 16,
    color: '#475569',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    fontSize: 13,
    lineHeight: 1.45,
  },

  textButton: {
    border: 'none',
    background: 'transparent',
    color: '#dc2626',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  chipGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 9,
  },

  chip: {
    border: '1px solid #eee9f7',
    background: '#ffffff',
    color: '#475569',
    borderRadius: 999,
    minHeight: 34,
    padding: '0 12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  },

  chipSelected: {
    borderColor: '#c4b5fd',
    background: '#f3e8ff',
    color: '#6d28d9',
    fontWeight: 600,
  },

  optionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 12,
  },

  optionCard: {
    border: '1px solid #eee9f7',
    borderRadius: 16,
    background: '#ffffff',
    padding: 14,
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    color: '#334155',
  },

  optionSelected: {
    borderColor: '#c4b5fd',
    background: '#faf5ff',
    color: '#5b21b6',
  },

  optionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    background: '#f3e8ff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  range: {
    width: '100%',
    accentColor: '#7c3aed',
  },

  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: 12,
  },

  imageTile: {
    position: 'relative',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid #eee9f7',
    background: '#faf8ff',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  removeImageBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 999,
    border: 'none',
    background: 'rgba(255,255,255,0.9)',
    color: '#dc2626',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  addImageTile: {
    minHeight: 120,
    borderRadius: 16,
    border: '1.5px dashed #c4b5fd',
    background: '#faf5ff',
    color: '#7c3aed',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
  },

  imageUploadPending: {
    minHeight: 120,
    borderRadius: 16,
    border: '1.5px dashed #cbd5e1',
    background: '#f8fafc',
    color: '#475569',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 700,
    padding: 14,
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 4,
  },

  secondaryBtn: {
    height: 42,
    border: '1px solid #eee9f7',
    background: '#ffffff',
    color: '#475569',
    borderRadius: 12,
    padding: '0 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },

  primaryBtn: {
    height: 42,
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#ffffff',
    borderRadius: 12,
    padding: '0 18px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 10px 22px rgba(124, 58, 237, 0.16)',
  },

  disabledBtn: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },

  errorText: {
    margin: 0,
    color: '#dc2626',
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'right',
  },

  preview: {
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 22,
    overflow: 'hidden',
    boxShadow: '0 14px 34px rgba(17, 24, 39, 0.06)',
  },

  previewHeader: {
    padding: '15px 17px',
    borderBottom: '1px solid #f5f1fb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: 700,
    color: '#151126',
  },

  previewCover: {
    height: 145,
    background: '#faf5ff',
  },

  previewCoverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  previewCoverPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 700,
  },

  previewBody: {
    padding: 18,
  },

  previewProfile: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    objectFit: 'cover',
    flexShrink: 0,
  },

  previewAvatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 16,
    background: '#f3e8ff',
    color: '#7c3aed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 800,
    flexShrink: 0,
  },

  previewTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: '#151126',
    lineHeight: 1.25,
  },

  previewSub: {
    margin: '4px 0 0',
    color: '#64748b',
    fontSize: 12,
  },

  previewDesc: {
    margin: '0 0 13px',
    color: '#475569',
    fontSize: 13,
    lineHeight: 1.5,
  },

  previewTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 14,
  },

  previewTag: {
    padding: '5px 9px',
    borderRadius: 999,
    background: '#f3e8ff',
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: 600,
  },

  previewInfo: {
    borderTop: '1px solid #f5f1fb',
    paddingTop: 10,
  },

  previewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    padding: '8px 0',
    fontSize: 12,
    color: '#64748b',
  },

  previewNote: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    background: '#ecfdf3',
    color: '#15803d',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    fontWeight: 700,
  },

  profileAvatarButton: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 999,
    border: '3px solid #ffffff',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    boxShadow: '0 10px 24px rgba(124, 58, 237, 0.18)',
    overflow: 'visible',
    cursor: 'pointer',
    flexShrink: 0,
  },

  profileAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    objectFit: 'cover',
    display: 'block',
  },

  profileAvatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 700,
  },

  profileCameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 999,
    background: '#7c3aed',
    color: '#ffffff',
    border: '2px solid #ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 700,
  },

  profileHint: {
    margin: '3px 0 0',
    fontSize: 12,
    color: '#94a3b8',
  },

  inlineInput: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 8,
  },

  inlineAddButton: {
    height: 42,
    border: 'none',
    borderRadius: 12,
    padding: '0 14px',
    background: '#f3e8ff',
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
};

function ProfileSnapshot({
  profile,
  onUploadAvatar,
}: {
  profile: ChefProfile;
  onUploadAvatar?: (file: File) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <section style={styles.profileCard}>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        style={styles.profileAvatarButton}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            style={styles.profileAvatarImg}
          />
        ) : (
          <span style={styles.profileAvatarFallback}>
            {profile.name.charAt(0).toUpperCase()}
          </span>
        )}

        <span style={styles.profileCameraBadge}>＋</span>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUploadAvatar?.(file);
        }}
      />

      <div style={{ flex: 1 }}>
        <div style={styles.profileTop}>
          <h2 style={styles.profileName}>{profile.name}</h2>
          <p style={styles.profileHint}>
            Profile photo is reused across your chef services.
          </p>
        </div>

        <p style={styles.profileMeta}>
          {profile.experience} experience · {profile.city}
        </p>

        <div style={styles.miniTags}>
          {profile.cuisines.map((item) => (
            <span key={item} style={styles.miniTag}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
