'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CalendarIcon, RejectIcon } from '@/components/Icons/DashboardIcons';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';
import {
  type City,
  type Country,
  type PartnerServicePayload,
  type PriceUnit,
  type UploadedAsset,
  deleteImageAsset,
  uploadImageAsset,
  useCreatePartnerService,
  useCreatePartnerServiceAddon,
  useCreatePartnerServicePricingTier,
  useSubmitPartnerService,
} from '@catering-marketplace/query-client';

type ServiceImage = UploadedAsset & { sortOrder: number };
type SelectOption = { key: string; label: string; description?: string };
type StepKey = 'basics' | 'space' | 'packages' | 'rules' | 'review';
type Updater = <K extends keyof EventForm>(key: K, value: EventForm[K]) => void;

type PackageDraft = {
  id: string;
  name: string;
  description: string;
  minGuests: string;
  maxGuests: string;
  price: string;
  priceUnit: Extract<PriceUnit, 'per_guest' | 'flat'>;
};

type AddonDraft = {
  id: string;
  label: string;
  description: string;
  price: string;
  priceUnit: Extract<PriceUnit, 'flat' | 'per_guest' | 'per_item'>;
};

type EventForm = {
  title: string;
  shortDescription: string;
  description: string;
  experienceTypeKey: string;
  cityId: string;
  city: string;
  currencyCode: string;
  address: string;
  venueType:
    | 'private_room'
    | 'full_buyout'
    | 'rooftop'
    | 'banquet'
    | 'chef_table';
  seatingStyle: 'seated' | 'buffet' | 'cocktail' | 'mixed';
  minGuests: string;
  maxGuests: string;
  advanceNoticeHours: string;
  eventTypes: string[];
  cuisines: string[];
  serviceStyles: string[];
  amenities: string[];
  packages: PackageDraft[];
  addons: AddonDraft[];
  images: ServiceImage[];
};

const steps: { key: StepKey; label: string }[] = [
  { key: 'basics', label: 'Basics' },
  { key: 'space', label: 'Space & dining' },
  { key: 'packages', label: 'Packages' },
  { key: 'rules', label: 'Rules & add-ons' },
  { key: 'review', label: 'Review' },
];

const DEFAULT_FORM: EventForm = {
  title: 'Private Dining Event at Our Restaurant',
  shortDescription:
    'Host birthdays, team dinners, and private celebrations in a curated restaurant space.',
  description:
    'A hosted private event experience with reserved dining space, a planned menu, service staff, and optional add-ons for decor, cake, live stations, or beverage service.',
  experienceTypeKey: '',
  cityId: '',
  city: '',
  currencyCode: 'INR',
  address: '',
  venueType: 'private_room',
  seatingStyle: 'seated',
  minGuests: '12',
  maxGuests: '80',
  advanceNoticeHours: '72',
  eventTypes: [],
  cuisines: [],
  serviceStyles: ['full_service'],
  amenities: ['private_space', 'service_staff'],
  packages: [
    {
      id: 'package-1',
      name: 'Private dining set menu',
      description:
        'Three-course set menu with reserved dining space and service staff.',
      minGuests: '12',
      maxGuests: '40',
      price: '1500',
      priceUnit: 'per_guest',
    },
  ],
  addons: [
    {
      id: 'addon-1',
      label: 'Cake arrangement',
      description: 'Cake coordination and presentation support.',
      price: '1200',
      priceUnit: 'flat',
    },
  ],
  images: [],
};

const fallbackCuisineOptions = [
  { key: 'north_indian', label: 'North Indian' },
  { key: 'continental', label: 'Continental' },
  { key: 'italian', label: 'Italian' },
  { key: 'pan_asian', label: 'Pan Asian' },
];
const fallbackEventTypeOptions = [
  { key: 'birthday', label: 'Birthday' },
  { key: 'corporate', label: 'Corporate Dinner' },
  { key: 'anniversary', label: 'Anniversary' },
  { key: 'engagement', label: 'Engagement' },
];
const fallbackServiceStyleOptions = [
  { key: 'full_service', label: 'Full Service' },
  { key: 'plated', label: 'Plated' },
  { key: 'buffet_setup', label: 'Buffet' },
  { key: 'live_counter', label: 'Live Counter' },
];
const fallbackVenueTypeOptions = [
  {
    key: 'private_room',
    label: 'Private room',
    description: 'Reserved dining room for small groups.',
  },
  {
    key: 'full_buyout',
    label: 'Full buyout',
    description: 'Customer books the complete restaurant.',
  },
  {
    key: 'rooftop',
    label: 'Rooftop',
    description: 'Hosted rooftop or terrace experience.',
  },
  {
    key: 'banquet',
    label: 'Banquet',
    description: 'Larger event-ready restaurant space.',
  },
];
const fallbackSeatingStyleOptions = [
  {
    key: 'seated',
    label: 'Seated',
    description: 'Course-led or table service event.',
  },
  {
    key: 'buffet',
    label: 'Buffet',
    description: 'Guests serve from buffet counters.',
  },
  {
    key: 'cocktail',
    label: 'Cocktail',
    description: 'Standing mixer with pass-around bites.',
  },
  {
    key: 'mixed',
    label: 'Mixed',
    description: 'Flexible seated and standing setup.',
  },
];
const fallbackAmenityOptions = [
  { key: 'private_space', label: 'Private Space' },
  { key: 'service_staff', label: 'Service Staff' },
  { key: 'audio_system', label: 'Audio System' },
  { key: 'decor_support', label: 'Decor Support' },
  { key: 'parking', label: 'Parking' },
  { key: 'bar_counter', label: 'Bar Counter' },
];

export default function CreateRestaurantEventPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { masterData, locations } = useOnboardingMasterDataContext();
  const { getExperienceTypesForService, getAttributeGroup } =
    useServiceCatalogMetaContext();
  const [form, setForm] = useState<EventForm>(DEFAULT_FORM);
  const [activeStep, setActiveStep] = useState<StepKey>('basics');
  const [submitError, setSubmitError] = useState('');
  const [mediaUploadError, setMediaUploadError] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [draftId] = useState(() =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `draft-${Date.now()}`
  );

  const createService = useCreatePartnerService();
  const submitService = useSubmitPartnerService();
  const createPricingTier = useCreatePartnerServicePricingTier();
  const createAddon = useCreatePartnerServiceAddon();

  const cityOptions = useMemo(() => getAllCities(locations), [locations]);
  const currencies = useMemo(
    () => getSupportedCurrencies(locations),
    [locations]
  );
  const selectedCountry = useMemo(
    () => findCountryByCity(locations, form.cityId, form.city),
    [form.city, form.cityId, locations]
  );
  const experiences = useMemo(
    () =>
      getExperienceTypesForService('restaurant_private_event').filter(
        (item) => item.is_active
      ),
    [getExperienceTypesForService]
  );
  const cuisineOptions = masterData?.cuisines || fallbackCuisineOptions;
  const eventTypeOptions = masterData?.event_types || fallbackEventTypeOptions;
  const serviceStyleOptions =
    masterData?.service_styles || fallbackServiceStyleOptions;
  const venueTypeOptions =
    getAttributeGroup('restaurant_private_event', 'venue_type')?.options ||
    fallbackVenueTypeOptions;
  const seatingStyleOptions =
    getAttributeGroup('restaurant_private_event', 'seating_style')?.options ||
    fallbackSeatingStyleOptions;
  const amenityOptions =
    getAttributeGroup('restaurant_private_event', 'amenities')?.options ||
    fallbackAmenityOptions;
  const partnerId = getSessionPartnerId(session?.user);
  const currencySymbol = getCurrencySymbol(form.currencyCode, currencies);
  const activeIndex = steps.findIndex((step) => step.key === activeStep);
  const stepValidity = useMemo(
    () => getStepValidity(form, currencies),
    [currencies, form]
  );
  const isValid = Object.values(stepValidity).every(Boolean);
  const isSubmitting =
    createService.isPending ||
    submitService.isPending ||
    createPricingTier.isPending ||
    createAddon.isPending;

  useEffect(() => {
    const first = experiences[0];
    if (!first) return;
    if (!experiences.some((item) => item.key === form.experienceTypeKey))
      setForm((prev) => ({ ...prev, experienceTypeKey: first.key }));
  }, [experiences, form.experienceTypeKey]);

  useEffect(() => {
    if (form.cityId || cityOptions.length === 0) return;
    const city = cityOptions[0];
    const country = findCountryByCity(locations, city.id, city.name);
    setForm((prev) => ({
      ...prev,
      cityId: city.id,
      city: city.name,
      currencyCode: country?.currencyCode || prev.currencyCode,
    }));
  }, [cityOptions, form.cityId, locations]);

  useEffect(() => {
    const nextCurrency =
      selectedCountry?.currencyCode ||
      currencies[0]?.code ||
      DEFAULT_FORM.currencyCode;
    if (nextCurrency && !isValidCurrencyCode(form.currencyCode))
      setForm((prev) => ({ ...prev, currencyCode: nextCurrency }));
  }, [currencies, form.currencyCode, selectedCountry?.currencyCode]);

  const update: Updater = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const toggleArray = <K extends keyof EventForm>(key: K, value: string) =>
    setForm((prev) => {
      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });

  const uploadServiceImages = async (files: FileList | null) => {
    if (!files?.length || uploadingMedia) return;
    if (!partnerId) {
      setMediaUploadError('Partner profile was not found for this session.');
      return;
    }
    setMediaUploadError('');
    setUploadingMedia(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file, offset) => {
          const asset = await uploadImageAsset(
            {
              scope: 'partner_service_media',
              partnerId,
              draftId,
              fileName: file.name,
              contentType: file.type,
              fileSize: file.size,
            },
            file
          );
          return { ...asset, sortOrder: form.images.length + offset };
        })
      );
      update('images', [...form.images, ...uploaded]);
    } catch (error) {
      setMediaUploadError(
        error instanceof Error ? error.message : 'Unable to upload event image.'
      );
    } finally {
      setUploadingMedia(false);
    }
  };

  const removeImage = async (image: ServiceImage) => {
    update(
      'images',
      form.images
        .filter((item) => item.key !== image.key)
        .map((item, index) => ({ ...item, sortOrder: index }))
    );
    if (!image.key) return;
    try {
      await deleteImageAsset({ fileKey: image.key, partnerId });
    } catch (error) {
      console.error('Failed to delete event image:', error);
    }
  };

  const goBack = () => {
    if (activeIndex === 0) router.push('/partner/services');
    else setActiveStep(steps[activeIndex - 1].key);
  };

  const goNext = () =>
    setActiveStep(steps[Math.min(activeIndex + 1, steps.length - 1)].key);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setSubmitError('');
    try {
      const created = await createService.mutateAsync(buildPayload(form));
      for (const item of normalizePackages(form.packages))
        await createPricingTier.mutateAsync({
          serviceId: created.id,
          min_guests: item.min_guests,
          max_guests: item.max_guests,
          price: item.price,
          price_unit: item.price_unit,
        });
      for (const addon of normalizeAddons(form.addons))
        await createAddon.mutateAsync({
          serviceId: created.id,
          key: addon.key,
          label: addon.label,
          description: addon.description,
          price: addon.price,
          price_unit: addon.price_unit,
          is_active: true,
          sort_order: addon.sort_order,
        });
      await submitService.mutateAsync(created.id);
      router.push('/partner/services');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to create private event service. Please try again.'
      );
    }
  };

  return (
    <div style={styles.page}>
      <button type="button" style={styles.backLink} onClick={goBack}>
        Back
      </button>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <CalendarIcon size={25} />
        </div>
        <div>
          <h1 style={styles.title}>Add Restaurant Private Event</h1>
          <p style={styles.subtitle}>
            Create hosted dining, private room, rooftop, or full-buyout event
            offerings.
          </p>
        </div>
      </div>
      <Stepper
        activeStep={activeStep}
        stepValidity={stepValidity}
        onSelect={setActiveStep}
      />
      <div style={styles.layout}>
        <main style={styles.left}>
          {activeStep === 'basics' && (
            <BasicsStep
              form={form}
              update={update}
              toggleArray={toggleArray}
              experiences={experiences}
              cuisineOptions={cuisineOptions}
              eventTypeOptions={eventTypeOptions}
              images={form.images}
              uploadingMedia={uploadingMedia}
              mediaUploadError={mediaUploadError}
              onUpload={uploadServiceImages}
              onRemove={removeImage}
            />
          )}
          {activeStep === 'space' && (
            <SpaceStep
              form={form}
              update={update}
              toggleArray={toggleArray}
              cityOptions={cityOptions}
              locations={locations}
              venueTypeOptions={venueTypeOptions}
              seatingStyleOptions={seatingStyleOptions}
              amenityOptions={amenityOptions}
              serviceStyleOptions={serviceStyleOptions}
            />
          )}
          {activeStep === 'packages' && (
            <PackagesStep
              form={form}
              update={update}
              currencySymbol={currencySymbol}
            />
          )}
          {activeStep === 'rules' && (
            <RulesStep form={form} update={update} currencies={currencies} />
          )}
          {activeStep === 'review' && (
            <ReviewStep
              form={form}
              currencySymbol={currencySymbol}
              onEdit={setActiveStep}
            />
          )}
          <div style={styles.actions}>
            <button type="button" onClick={goBack} style={styles.secondaryBtn}>
              {activeIndex === 0 ? 'Cancel' : 'Back'}
            </button>
            {activeStep === 'review' ? (
              <button
                type="button"
                disabled={!isValid || isSubmitting}
                onClick={handleSubmit}
                style={{
                  ...styles.primaryBtn,
                  ...(!isValid || isSubmitting ? styles.disabledBtn : {}),
                }}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Private Event'}
              </button>
            ) : (
              <button
                type="button"
                disabled={!stepValidity[activeStep]}
                onClick={goNext}
                style={{
                  ...styles.primaryBtn,
                  ...(!stepValidity[activeStep] ? styles.disabledBtn : {}),
                }}
              >
                Save & Continue
              </button>
            )}
          </div>
          {submitError && <p style={styles.errorText}>{submitError}</p>}
        </main>
        <aside style={styles.right}>
          <EventPreview
            form={form}
            currencySymbol={currencySymbol}
            stepValidity={stepValidity}
          />
        </aside>
      </div>
    </div>
  );
}

function BasicsStep({
  form,
  update,
  toggleArray,
  experiences,
  cuisineOptions,
  eventTypeOptions,
  images,
  uploadingMedia,
  mediaUploadError,
  onUpload,
  onRemove,
}: {
  form: EventForm;
  update: Updater;
  toggleArray: <K extends keyof EventForm>(key: K, value: string) => void;
  experiences: SelectOption[];
  cuisineOptions: SelectOption[];
  eventTypeOptions: SelectOption[];
  images: ServiceImage[];
  uploadingMedia: boolean;
  mediaUploadError: string;
  onUpload: (files: FileList | null) => void;
  onRemove: (image: ServiceImage) => void;
}) {
  return (
    <Panel
      title="Basic Information"
      subtitle="Position the restaurant event clearly for customers."
    >
      <div style={styles.grid2}>
        <Field label="Offering name" required>
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            style={styles.input}
          />
        </Field>
        <Field label="Experience" required>
          <SelectWrap>
            <select
              value={form.experienceTypeKey}
              onChange={(e) => update('experienceTypeKey', e.target.value)}
              style={styles.select}
            >
              {experiences.length === 0 && (
                <option value="private_dining">Private Dining</option>
              )}
              {experiences.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </SelectWrap>
        </Field>
      </div>
      <Field label="Short description" required>
        <textarea
          value={form.shortDescription}
          onChange={(e) => update('shortDescription', e.target.value)}
          rows={3}
          maxLength={160}
          style={styles.textarea}
        />
        <p style={styles.helper}>{form.shortDescription.length}/160</p>
      </Field>
      <Field label="Full description" required>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
          style={styles.textarea}
        />
      </Field>
      <TagBlock
        label="Event types"
        required
        options={eventTypeOptions}
        selected={form.eventTypes}
        onToggle={(key) => toggleArray('eventTypes', key)}
      />
      <TagBlock
        label="Cuisines"
        required
        options={cuisineOptions}
        selected={form.cuisines}
        onToggle={(key) => toggleArray('cuisines', key)}
      />
      <ServiceImageGallery
        images={images}
        uploading={uploadingMedia}
        error={mediaUploadError}
        onUpload={onUpload}
        onRemove={onRemove}
      />
    </Panel>
  );
}
function SpaceStep({
  form,
  update,
  toggleArray,
  cityOptions,
  locations,
  venueTypeOptions,
  seatingStyleOptions,
  amenityOptions,
  serviceStyleOptions,
}: {
  form: EventForm;
  update: Updater;
  toggleArray: <K extends keyof EventForm>(key: K, value: string) => void;
  cityOptions: City[];
  locations: { countries: Country[] } | undefined;
  venueTypeOptions: SelectOption[];
  seatingStyleOptions: SelectOption[];
  amenityOptions: SelectOption[];
  serviceStyleOptions: SelectOption[];
}) {
  return (
    <Panel
      title="Space & Dining"
      subtitle="Set the hosted location, capacity, dining format, and amenities."
    >
      <div style={styles.grid2}>
        <Field label="City" required>
          <CitySelect
            value={form.cityId}
            fallbackCity={form.city || 'Select city'}
            cityOptions={cityOptions}
            onChange={(city) => {
              const country = findCountryByCity(
                locations,
                city?.id || '',
                city?.name || ''
              );
              update('cityId', city?.id || '');
              update('city', city?.name || form.city);
              update(
                'currencyCode',
                country?.currencyCode || form.currencyCode
              );
            }}
          />
        </Field>
        <Field label="Restaurant address" required>
          <input
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            style={styles.input}
            placeholder="Restaurant, area, landmark"
          />
        </Field>
      </div>
      <div style={styles.optionGrid}>
        {venueTypeOptions.map((option) => (
          <OptionButton
            key={option.key}
            active={form.venueType === option.key}
            title={option.label}
            text={option.description || 'Hosted restaurant event space.'}
            onClick={() =>
              update('venueType', option.key as EventForm['venueType'])
            }
          />
        ))}
      </div>
      <div style={styles.optionGrid}>
        {seatingStyleOptions.map((option) => (
          <OptionButton
            key={option.key}
            active={form.seatingStyle === option.key}
            title={option.label}
            text={option.description || 'Restaurant dining setup.'}
            onClick={() =>
              update('seatingStyle', option.key as EventForm['seatingStyle'])
            }
          />
        ))}
      </div>
      <TagBlock
        label="Amenities"
        options={amenityOptions}
        selected={form.amenities}
        onToggle={(key) => toggleArray('amenities', key)}
      />
      <TagBlock
        label="Service styles"
        options={serviceStyleOptions}
        selected={form.serviceStyles}
        onToggle={(key) => toggleArray('serviceStyles', key)}
      />
    </Panel>
  );
}
function PackagesStep({
  form,
  update,
  currencySymbol,
}: {
  form: EventForm;
  update: Updater;
  currencySymbol: string;
}) {
  return (
    <Panel
      title="Packages"
      subtitle="Use simple event packages customers can compare before requesting."
    >
      <div style={styles.stack}>
        {form.packages.map((item, index) => (
          <div key={item.id} style={styles.nestedCard}>
            <CardHeader
              title={item.name || `Package ${index + 1}`}
              onRemove={
                form.packages.length > 1
                  ? () =>
                      update(
                        'packages',
                        form.packages.filter((row) => row.id !== item.id)
                      )
                  : undefined
              }
            />
            <div style={styles.grid2}>
              <Field label="Package name" required>
                <input
                  value={item.name}
                  onChange={(e) =>
                    updatePackage(form, update, item.id, {
                      name: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
              <Field label="Price unit">
                <PriceUnitSelect
                  value={item.priceUnit}
                  values={['per_guest', 'flat']}
                  onChange={(value) =>
                    updatePackage(form, update, item.id, {
                      priceUnit: value as PackageDraft['priceUnit'],
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                value={item.description}
                onChange={(e) =>
                  updatePackage(form, update, item.id, {
                    description: e.target.value,
                  })
                }
                rows={3}
                style={styles.textarea}
              />
            </Field>
            <div style={styles.grid3}>
              <Field label="Min guests" required>
                <input
                  type="number"
                  value={item.minGuests}
                  onChange={(e) =>
                    updatePackage(form, update, item.id, {
                      minGuests: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
              <Field label="Max guests">
                <input
                  type="number"
                  value={item.maxGuests}
                  onChange={(e) =>
                    updatePackage(form, update, item.id, {
                      maxGuests: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
              <Field label={`Price (${currencySymbol})`} required>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    updatePackage(form, update, item.id, {
                      price: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        style={styles.inlineAddButton}
        onClick={() =>
          update('packages', [
            ...form.packages,
            {
              id: `package-${Date.now()}`,
              name: `Package ${form.packages.length + 1}`,
              description: '',
              minGuests: form.minGuests || '12',
              maxGuests: '',
              price: '',
              priceUnit: 'per_guest',
            },
          ])
        }
      >
        Add package
      </button>
    </Panel>
  );
}
function RulesStep({
  form,
  update,
  currencies,
}: {
  form: EventForm;
  update: Updater;
  currencies: { code: string; label: string }[];
}) {
  return (
    <Panel
      title="Rules & Add-ons"
      subtitle="Confirm capacity, notice period, currency, and optional extras."
    >
      <div style={styles.grid3}>
        <Field label="Currency" required>
          {currencies.length > 0 ? (
            <CurrencySelect
              value={form.currencyCode}
              currencies={currencies}
              onChange={(value) => update('currencyCode', value)}
            />
          ) : (
            <input
              value={form.currencyCode}
              onChange={(e) =>
                update('currencyCode', e.target.value.toUpperCase())
              }
              maxLength={3}
              style={styles.input}
            />
          )}
        </Field>
        <Field label="Minimum guests" required>
          <input
            type="number"
            value={form.minGuests}
            onChange={(e) => update('minGuests', e.target.value)}
            style={styles.input}
          />
        </Field>
        <Field label="Maximum guests" required>
          <input
            type="number"
            value={form.maxGuests}
            onChange={(e) => update('maxGuests', e.target.value)}
            style={styles.input}
          />
        </Field>
        <Field label="Advance notice">
          <input
            type="number"
            value={form.advanceNoticeHours}
            onChange={(e) => update('advanceNoticeHours', e.target.value)}
            style={styles.input}
          />
        </Field>
      </div>
      <div style={styles.stack}>
        {form.addons.map((addon, index) => (
          <div key={addon.id} style={styles.nestedCard}>
            <CardHeader
              title={`Add-on ${index + 1}`}
              onRemove={() =>
                update(
                  'addons',
                  form.addons.filter((item) => item.id !== addon.id)
                )
              }
            />
            <div style={styles.grid2}>
              <Field label="Add-on name">
                <input
                  value={addon.label}
                  onChange={(e) =>
                    updateAddon(form, update, addon.id, {
                      label: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
              <Field label="Price unit">
                <PriceUnitSelect
                  value={addon.priceUnit}
                  values={['flat', 'per_guest', 'per_item']}
                  onChange={(value) =>
                    updateAddon(form, update, addon.id, {
                      priceUnit: value as AddonDraft['priceUnit'],
                    })
                  }
                />
              </Field>
              <Field label="Description">
                <input
                  value={addon.description}
                  onChange={(e) =>
                    updateAddon(form, update, addon.id, {
                      description: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
              <Field label={`Price (${form.currencyCode})`}>
                <input
                  type="number"
                  value={addon.price}
                  onChange={(e) =>
                    updateAddon(form, update, addon.id, {
                      price: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        style={styles.inlineAddButton}
        onClick={() =>
          update('addons', [
            ...form.addons,
            {
              id: `addon-${Date.now()}`,
              label: '',
              description: '',
              price: '',
              priceUnit: 'flat',
            },
          ])
        }
      >
        Add add-on
      </button>
    </Panel>
  );
}
function ReviewStep({
  form,
  currencySymbol,
  onEdit,
}: {
  form: EventForm;
  currencySymbol: string;
  onEdit: (step: StepKey) => void;
}) {
  return (
    <Panel
      title="Review Private Event"
      subtitle="Check the hosted event details before publishing."
    >
      <div style={styles.reviewGrid}>
        <ReviewCard
          title="Basics"
          onEdit={() => onEdit('basics')}
          items={[
            form.title,
            form.shortDescription,
            `${form.eventTypes.length} event types`,
            `${form.cuisines.length} cuisines`,
          ]}
        />
        <ReviewCard
          title="Space"
          onEdit={() => onEdit('space')}
          items={[
            formatVenueType(form.venueType),
            formatSeatingStyle(form.seatingStyle),
            form.city,
            form.address,
          ]}
        />
        <ReviewCard
          title="Packages"
          onEdit={() => onEdit('packages')}
          items={form.packages.map((item) => item.name)}
        />
        <ReviewCard
          title="Rules"
          onEdit={() => onEdit('rules')}
          items={[
            `${form.minGuests}-${form.maxGuests} guests`,
            `${form.advanceNoticeHours} hours notice`,
            `${currencySymbol}${normalizePackages(form.packages)[0]?.price || 0} starting`,
          ]}
        />
      </div>
    </Panel>
  );
}

function buildPayload(form: EventForm): PartnerServicePayload {
  const packages = normalizePackages(form.packages);
  return {
    service_key: 'restaurant_private_event',
    experience_type_key: form.experienceTypeKey || 'private_dining',
    title: form.title.trim(),
    short_description: form.shortDescription.trim(),
    description: form.description.trim(),
    booking_type: 'quote',
    pricing_model: 'package',
    base_price: packages[0]?.price ?? null,
    currency_code: form.currencyCode,
    min_guests: toNumberOrNull(form.minGuests),
    max_guests: toNumberOrNull(form.maxGuests),
    advance_notice_hours: toNumberOrNull(form.advanceNoticeHours) || 72,
    service_areas: [
      {
        city_id: form.cityId || null,
        city: form.city,
        area: form.address,
        service_area_id: null,
        postal_code: null,
        latitude: null,
        longitude: null,
        radius_km: null,
      },
    ],
    media: form.images.map((image, index) => ({
      url: image.url,
      key: image.key,
      public_id: image.publicId || image.key,
      provider: image.provider || 'firebase',
      file_name: image.fileName,
      content_type: image.contentType,
      size: image.size,
      type: index === 0 ? 'cover' : 'gallery',
      sort_order: index,
    })),
    attributes: {
      event_types: form.eventTypes,
      cuisines: form.cuisines,
      service_styles: form.serviceStyles,
      amenities: form.amenities,
      venue_type: form.venueType,
      seating_style: form.seatingStyle,
      address: form.address,
      city: form.city,
      city_id: form.cityId || null,
      packages: packages.map((item, index) => ({
        ...item,
        key: slugify(item.name, `package_${index + 1}`),
      })),
      location_model: 'hosted_location',
    },
    is_active: true,
  };
}
function getStepValidity(
  form: EventForm,
  currencies: { code: string }[]
): Record<StepKey, boolean> {
  const knownCurrency =
    currencies.length === 0 ||
    currencies.some((item) => item.code === form.currencyCode);
  return {
    basics: Boolean(
      form.title.trim() &&
      form.shortDescription.trim() &&
      form.description.trim() &&
      form.experienceTypeKey &&
      form.eventTypes.length > 0 &&
      form.cuisines.length > 0
    ),
    space: Boolean(
      form.city.trim() && form.address.trim() && form.amenities.length > 0
    ),
    packages: normalizePackages(form.packages).length > 0,
    rules: Boolean(
      Number(form.minGuests) > 0 &&
      Number(form.maxGuests) >= Number(form.minGuests) &&
      isValidCurrencyCode(form.currencyCode) &&
      knownCurrency
    ),
    review: true,
  };
}
function normalizePackages(packages: PackageDraft[]) {
  return packages
    .map((item, index) => ({
      name: item.name.trim(),
      description: item.description.trim(),
      min_guests: toNumberOrNull(item.minGuests) || 0,
      max_guests: toNumberOrNull(item.maxGuests),
      price: toNumberOrNull(item.price) || 0,
      price_unit: item.priceUnit,
      sort_order: index,
    }))
    .filter((item) => item.name && item.min_guests > 0);
}
function normalizeAddons(addons: AddonDraft[]) {
  return addons
    .map((item, index) => ({
      key: slugify(item.label, `addon_${index + 1}`),
      label: item.label.trim(),
      description: item.description.trim(),
      price: toNumberOrNull(item.price) || 0,
      price_unit: item.priceUnit,
      sort_order: index,
    }))
    .filter((item) => item.label);
}
function updatePackage(
  form: EventForm,
  update: Updater,
  id: string,
  patch: Partial<PackageDraft>
) {
  update(
    'packages',
    form.packages.map((item) => (item.id === id ? { ...item, ...patch } : item))
  );
}
function updateAddon(
  form: EventForm,
  update: Updater,
  id: string,
  patch: Partial<AddonDraft>
) {
  update(
    'addons',
    form.addons.map((item) => (item.id === id ? { ...item, ...patch } : item))
  );
}
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
function findCountryByCity(
  locations: { countries: Country[] } | undefined,
  cityId: string,
  cityName: string
) {
  for (const country of locations?.countries || [])
    for (const state of country.states || []) {
      const matchedCity = state.cities?.find(
        (city) => city.id === cityId || city.name === cityName
      );
      if (matchedCity) return country;
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
function getSessionPartnerId(sessionUser: unknown) {
  const user = sessionUser as
    | { partner?: { id?: string | null } | null }
    | undefined;
  return user?.partner?.id || '';
}
function isValidCurrencyCode(value: string) {
  return /^[A-Z]{3}$/.test(value.trim());
}
function toNumberOrNull(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}
function slugify(value: string, fallback: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || fallback
  );
}
function formatPriceUnit(value: PriceUnit) {
  if (value === 'per_guest') return 'per guest';
  if (value === 'per_item') return 'per item';
  return 'flat';
}
function formatVenueType(value: EventForm['venueType']) {
  return value
    .split('_')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
}
function formatSeatingStyle(value: EventForm['seatingStyle']) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Stepper({
  activeStep,
  stepValidity,
  onSelect,
}: {
  activeStep: StepKey;
  stepValidity: Record<StepKey, boolean>;
  onSelect: (step: StepKey) => void;
}) {
  const activeIndex = steps.findIndex((step) => step.key === activeStep);
  return (
    <div style={styles.stepper}>
      {steps.map((step, index) => {
        const active = step.key === activeStep;
        const complete = stepValidity[step.key] && index < activeIndex;
        return (
          <button
            key={step.key}
            type="button"
            style={{
              ...styles.step,
              ...(active ? styles.stepActive : {}),
              ...(complete ? styles.stepComplete : {}),
            }}
            onClick={() => onSelect(step.key)}
          >
            <span style={styles.stepDot}>{complete ? 'OK' : index + 1}</span>
            <span>{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <h2 style={styles.panelTitle}>{title}</h2>
        {subtitle && <p style={styles.panelSub}>{subtitle}</p>}
      </div>
      <div style={styles.panelBody}>{children}</div>
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
      <span style={styles.label}>
        {label} {required && <span style={styles.required}>*</span>}
      </span>
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
function CurrencySelect({
  value,
  currencies,
  onChange,
}: {
  value: string;
  currencies: { code: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <SelectWrap>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.label}
          </option>
        ))}
      </select>
    </SelectWrap>
  );
}
function PriceUnitSelect({
  value,
  values,
  onChange,
}: {
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <SelectWrap>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {formatPriceUnit(item as PriceUnit)}
          </option>
        ))}
      </select>
    </SelectWrap>
  );
}
function TagBlock({
  label,
  required,
  options,
  selected,
  onToggle,
}: {
  label: string;
  required?: boolean;
  options: SelectOption[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div style={styles.block}>
      <span style={styles.label}>
        {label} {required && <span style={styles.required}>*</span>}
      </span>
      <div style={styles.chipGrid}>
        {options.map((item) => (
          <button
            key={item.key}
            type="button"
            style={{
              ...styles.chip,
              ...(selected.includes(item.key) ? styles.chipSelected : {}),
            }}
            onClick={() => onToggle(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
function OptionButton({
  active,
  title,
  text,
  onClick,
}: {
  active: boolean;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      style={{
        ...styles.optionButton,
        ...(active ? styles.optionButtonActive : {}),
      }}
      onClick={onClick}
    >
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}
function CardHeader({
  title,
  onRemove,
}: {
  title: string;
  onRemove?: () => void;
}) {
  return (
    <div style={styles.cardHeader}>
      <strong>{title}</strong>
      {onRemove && (
        <button type="button" style={styles.textButton} onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}
function ReviewCard({
  title,
  items,
  onEdit,
}: {
  title: string;
  items: string[];
  onEdit: () => void;
}) {
  return (
    <div style={styles.reviewCard}>
      <div style={styles.cardHeader}>
        <strong>{title}</strong>
        <button type="button" style={styles.textButton} onClick={onEdit}>
          Edit
        </button>
      </div>
      {items
        .filter(Boolean)
        .slice(0, 5)
        .map((item) => (
          <span key={item} style={styles.reviewItem}>
            {item}
          </span>
        ))}
    </div>
  );
}
function ServiceImageGallery({
  images,
  uploading,
  error,
  onUpload,
  onRemove,
}: {
  images: ServiceImage[];
  uploading: boolean;
  error: string;
  onUpload: (files: FileList | null) => void;
  onRemove: (image: ServiceImage) => void;
}) {
  return (
    <div>
      <div style={styles.imageGrid}>
        {images.map((image, index) => (
          <div key={`${image.key}-${index}`} style={styles.imageTile}>
            <img
              src={image.url}
              alt="Restaurant private event"
              style={styles.image}
            />
            <button
              type="button"
              onClick={() => onRemove(image)}
              style={styles.removeImageBtn}
            >
              <RejectIcon size={13} />
            </button>
          </div>
        ))}
        <label style={styles.addImageTile}>
          <span>{uploading ? 'Uploading...' : '+ Add photos'}</span>
          <small>Dining room, rooftop, tablescape, menu, or ambience</small>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            hidden
            disabled={uploading}
            onChange={(event) => {
              onUpload(event.target.files);
              event.target.value = '';
            }}
          />
        </label>
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}
function EventPreview({
  form,
  currencySymbol,
  stepValidity,
}: {
  form: EventForm;
  currencySymbol: string;
  stepValidity: Record<StepKey, boolean>;
}) {
  const firstPackage = normalizePackages(form.packages)[0];
  return (
    <div style={styles.preview}>
      <div style={styles.previewHeader}>
        <span>Preview</span>
        <StatusBadge status="under_review" label="Draft" />
      </div>
      <div style={styles.previewCover}>
        {form.images[0]?.url ? (
          <img
            src={form.images[0].url}
            alt={form.title}
            style={styles.previewCoverImg}
          />
        ) : (
          <div style={styles.previewCoverPlaceholder}>No event photo yet</div>
        )}
      </div>
      <div style={styles.previewBody}>
        <h2 style={styles.previewTitle}>
          {form.title || 'Private Event Title'}
        </h2>
        <p style={styles.previewDesc}>{form.shortDescription}</p>
        <div style={styles.previewTags}>
          {form.eventTypes.slice(0, 3).map((item) => (
            <span key={item} style={styles.previewTag}>
              {item}
            </span>
          ))}
          <span style={styles.previewTag}>
            {formatVenueType(form.venueType)}
          </span>
        </div>
        <div style={styles.previewInfo}>
          <PreviewRow label="Venue" value={formatVenueType(form.venueType)} />
          <PreviewRow
            label="Guests"
            value={`${form.minGuests}-${form.maxGuests}`}
          />
          <PreviewRow
            label="Starting at"
            value={
              firstPackage
                ? `${currencySymbol}${firstPackage.price} ${formatPriceUnit(firstPackage.price_unit)}`
                : 'Add pricing'
            }
          />
          <PreviewRow label="Location" value={form.city || 'City'} />
          <PreviewRow label="Add-ons" value={`${form.addons.length} options`} />
        </div>
        <div style={styles.previewChecklist}>
          {steps.slice(0, -1).map((step) => (
            <span key={step.key} style={styles.previewCheck}>
              {stepValidity[step.key] ? 'OK' : 'Todo'} {step.label}
            </span>
          ))}
        </div>
      </div>
    </div>
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

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '6px 0 32px',
    color: '#111827',
    fontFamily: 'var(--font-manrope), var(--font-sora), sans-serif',
  },
  backLink: {
    border: 'none',
    background: 'transparent',
    color: '#374151',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    marginBottom: 12,
  },
  header: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    background: '#43a047',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.15,
    fontWeight: 600,
    letterSpacing: 0,
  },
  subtitle: {
    margin: '5px 0 0',
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 1.5,
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  step: {
    border: 'none',
    background: 'transparent',
    color: '#6b7280',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '6px 4px',
  },
  stepActive: { color: '#43a047' },
  stepComplete: { color: '#43a047' },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    border: '1px solid currentColor',
    fontSize: 11,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 330px',
    gap: 22,
    alignItems: 'start',
  },
  left: { display: 'flex', flexDirection: 'column', gap: 16 },
  right: { position: 'sticky', top: 18 },
  panel: {
    background: '#ffffff',
    border: '1px solid #e8ecf2',
    borderRadius: 12,
    boxShadow: '0 14px 40px rgba(17, 24, 39, 0.05)',
    overflow: 'hidden',
  },
  panelHeader: { padding: '18px 20px 8px' },
  panelTitle: {
    margin: 0,
    fontSize: 17,
    lineHeight: 1.35,
    fontWeight: 600,
    letterSpacing: 0,
  },
  panelSub: {
    margin: '6px 0 0',
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 1.5,
  },
  panelBody: { padding: 20, display: 'flex', flexDirection: 'column', gap: 16 },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 14,
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 14,
  },
  stack: { display: 'flex', flexDirection: 'column', gap: 12 },
  block: { display: 'flex', flexDirection: 'column', gap: 9 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { color: '#374151', fontSize: 13, fontWeight: 600 },
  required: { color: '#dc2626' },
  input: {
    width: '100%',
    minHeight: 42,
    border: '1px solid #d8dce5',
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 14,
    outline: 'none',
    background: '#ffffff',
    color: '#111827',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    border: '1px solid #d8dce5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    background: '#ffffff',
    color: '#111827',
    boxSizing: 'border-box',
    lineHeight: 1.55,
  },
  selectWrap: { position: 'relative' },
  select: {
    width: '100%',
    minHeight: 42,
    border: '1px solid #d8dce5',
    borderRadius: 8,
    padding: '0 34px 0 12px',
    fontSize: 14,
    outline: 'none',
    background: '#ffffff',
    color: '#111827',
    appearance: 'none',
    boxSizing: 'border-box',
  },
  selectChevron: {
    position: 'absolute',
    top: '50%',
    right: 13,
    transform: 'translateY(-50%)',
    color: '#6b7280',
    fontSize: 12,
    pointerEvents: 'none',
  },
  helper: {
    margin: '8px 0 0',
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 1.45,
  },
  chipGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 34,
    border: '1px solid #d8dce5',
    borderRadius: 8,
    padding: '0 12px',
    background: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  chipSelected: {
    borderColor: '#43a047',
    background: '#ecfdf3',
    color: '#43a047',
  },
  optionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
  },
  optionButton: {
    border: '1px solid #e0e5ec',
    borderRadius: 10,
    background: '#ffffff',
    padding: 14,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    cursor: 'pointer',
    color: '#374151',
  },
  optionButtonActive: { borderColor: '#43a047', background: '#f0fdf4' },
  nestedCard: {
    border: '1px solid #e6e9f0',
    borderRadius: 10,
    padding: 14,
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    color: '#111827',
    fontSize: 14,
  },
  textButton: {
    border: 'none',
    background: 'transparent',
    color: '#43a047',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    padding: 0,
  },
  inlineAddButton: {
    minHeight: 38,
    border: '1px solid #b7dfbd',
    borderRadius: 8,
    background: '#ffffff',
    color: '#43a047',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    padding: '0 13px',
    alignSelf: 'flex-start',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    paddingTop: 2,
  },
  secondaryBtn: {
    height: 42,
    border: '1px solid #d8dce5',
    borderRadius: 8,
    background: '#ffffff',
    color: '#374151',
    fontWeight: 600,
    padding: '0 16px',
    cursor: 'pointer',
  },
  primaryBtn: {
    height: 42,
    border: 'none',
    borderRadius: 8,
    background: '#43a047',
    color: '#ffffff',
    fontWeight: 600,
    padding: '0 18px',
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(67, 160, 71, 0.18)',
  },
  disabledBtn: { opacity: 0.55, cursor: 'not-allowed', boxShadow: 'none' },
  errorText: { margin: 0, color: '#dc2626', fontSize: 13, fontWeight: 600 },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))',
    gap: 12,
  },
  imageTile: {
    position: 'relative',
    height: 116,
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    border: 'none',
    borderRadius: 8,
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(17, 24, 39, 0.74)',
    color: '#ffffff',
    cursor: 'pointer',
  },
  addImageTile: {
    minHeight: 116,
    borderRadius: 10,
    border: '1px dashed #b7dfbd',
    background: '#f0fdf4',
    color: '#43a047',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 5,
    padding: 14,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
  },
  preview: {
    background: '#ffffff',
    border: '1px solid #e8ecf2',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(17, 24, 39, 0.08)',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid #f1f3f7',
    color: '#43a047',
    fontSize: 13,
    fontWeight: 600,
  },
  previewCover: {
    height: 150,
    background: '#f3f4f6',
    margin: 14,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewCoverImg: { width: '100%', height: '100%', objectFit: 'cover' },
  previewCoverPlaceholder: {
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: 600,
  },
  previewBody: {
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  previewTitle: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.25,
    fontWeight: 600,
    letterSpacing: 0,
    textAlign: 'center',
  },
  previewDesc: {
    margin: 0,
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 1.55,
    textAlign: 'center',
  },
  previewTags: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
  },
  previewTag: {
    borderRadius: 7,
    padding: '5px 8px',
    background: '#ecfdf3',
    color: '#43a047',
    fontSize: 11,
    fontWeight: 600,
  },
  previewInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    borderTop: '1px solid #f1f3f7',
    paddingTop: 12,
  },
  previewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    color: '#6b7280',
    fontSize: 13,
  },
  previewChecklist: {
    display: 'grid',
    gap: 7,
    borderTop: '1px solid #f1f3f7',
    paddingTop: 12,
  },
  previewCheck: { color: '#374151', fontSize: 12, fontWeight: 600 },
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 14,
  },
  reviewCard: {
    minHeight: 140,
    border: '1px solid #e6e9f0',
    borderRadius: 10,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  reviewItem: { color: '#4b5563', fontSize: 13, lineHeight: 1.4 },
};
