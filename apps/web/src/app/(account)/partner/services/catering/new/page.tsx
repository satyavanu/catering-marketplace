'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ApprovalIcon,
  CalendarIcon,
  RejectIcon,
} from '@/components/Icons/DashboardIcons';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';
import {
  type City,
  type Country,
  type FoodType,
  type PartnerServicePayload,
  type PriceUnit,
  type ServiceArea,
  type UploadedAsset,
  deleteImageAsset,
  uploadImageAsset,
  useCreatePartnerService,
  useCreatePartnerServiceAddon,
  useCreatePartnerServiceMenuItem,
  useCreatePartnerServiceMenuSection,
  useCreatePartnerServicePricingTier,
  useSubmitPartnerService,
} from '@catering-marketplace/query-client';

type ServiceImage = UploadedAsset & { sortOrder: number };
type SelectOption = { key: string; label: string };
type StepKey =
  | 'basic'
  | 'menu'
  | 'packages'
  | 'pricing'
  | 'delivery'
  | 'review';
type Updater = <K extends keyof CateringForm>(
  key: K,
  value: CateringForm[K]
) => void;

type PricingPackageDraft = {
  id: string;
  name: string;
  description: string;
  minGuests: string;
  maxGuests: string;
  price: string;
  priceUnit: Extract<PriceUnit, 'per_guest' | 'per_plate' | 'flat'>;
};

type MenuItemDraft = {
  id: string;
  name: string;
  description: string;
  foodType: FoodType | '';
  isIncluded: boolean;
  extraPrice: string;
  priceUnit: Extract<PriceUnit, 'per_guest' | 'per_item' | 'flat'>;
};

type MenuSectionDraft = {
  id: string;
  label: string;
  minSelect: string;
  maxSelect: string;
  isRequired: boolean;
  items: MenuItemDraft[];
};

type AddonDraft = {
  id: string;
  label: string;
  description: string;
  price: string;
  priceUnit: Extract<PriceUnit, 'flat' | 'per_guest' | 'per_item'>;
};

type CateringForm = {
  title: string;
  shortDescription: string;
  description: string;
  experienceTypeKey: string;
  cityId: string;
  city: string;
  areas: string[];
  currencyCode: string;
  minGuests: string;
  maxGuests: string;
  advanceNoticeHours: string;
  bookingType: 'quote' | 'request_only';
  cuisines: string[];
  dietTypes: string[];
  serviceStyles: string[];
  eventTypes: string[];
  packages: PricingPackageDraft[];
  sections: MenuSectionDraft[];
  addons: AddonDraft[];
  images: ServiceImage[];
};

const steps: { key: StepKey; label: string }[] = [
  { key: 'basic', label: 'Basic info' },
  { key: 'menu', label: 'Global menu' },
  { key: 'packages', label: 'Packages' },
  { key: 'pricing', label: 'Service & pricing' },
  { key: 'delivery', label: 'Delivery & area' },
  { key: 'review', label: 'Review' },
];

const DEFAULT_FORM: CateringForm = {
  title: 'Event Catering Package',
  shortDescription:
    'Fresh, professionally managed catering for parties, office events, and celebrations.',
  description:
    'A complete catering service with menu planning, preparation, delivery, and optional setup support. Menus can be adjusted based on event size, cuisine preferences, and dietary needs.',
  experienceTypeKey: '',
  cityId: '',
  city: '',
  areas: [],
  currencyCode: 'INR',
  minGuests: '25',
  maxGuests: '300',
  advanceNoticeHours: '48',
  bookingType: 'quote',
  cuisines: [],
  dietTypes: [],
  serviceStyles: [],
  eventTypes: [],
  packages: [
    {
      id: 'package-1',
      name: 'Classic package',
      description:
        'Balanced menu for family gatherings, office lunches, and small events.',
      minGuests: '25',
      maxGuests: '75',
      price: '450',
      priceUnit: 'per_guest',
    },
  ],
  sections: [
    {
      id: 'section-1',
      label: 'Starters',
      minSelect: '1',
      maxSelect: '3',
      isRequired: true,
      items: [
        {
          id: 'item-1',
          name: 'Paneer tikka',
          description: 'Marinated paneer with peppers and house spices.',
          foodType: 'veg',
          isIncluded: true,
          extraPrice: '',
          priceUnit: 'per_guest',
        },
      ],
    },
    {
      id: 'section-2',
      label: 'Main course',
      minSelect: '2',
      maxSelect: '4',
      isRequired: true,
      items: [
        {
          id: 'item-2',
          name: 'Veg biryani',
          description: 'Aromatic rice with seasonal vegetables and raita.',
          foodType: 'veg',
          isIncluded: true,
          extraPrice: '',
          priceUnit: 'per_guest',
        },
      ],
    },
  ],
  addons: [
    {
      id: 'addon-1',
      label: 'Live counter',
      description:
        'Chef-attended live station for dosa, chaat, pasta, or grill.',
      price: '5000',
      priceUnit: 'flat',
    },
  ],
  images: [],
};

const fallbackCuisineOptions = [
  { key: 'north_indian', label: 'North Indian' },
  { key: 'south_indian', label: 'South Indian' },
  { key: 'continental', label: 'Continental' },
  { key: 'chinese', label: 'Chinese' },
];
const fallbackDietTypeOptions = [
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'non_vegetarian', label: 'Non-Vegetarian' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'jain', label: 'Jain Food' },
];
const fallbackServiceStyleOptions = [
  { key: 'delivery_only', label: 'Delivery Only' },
  { key: 'buffet_setup', label: 'Buffet Setup' },
  { key: 'live_counter', label: 'Live Counter' },
  { key: 'full_service', label: 'Full Service' },
];
const fallbackEventTypeOptions = [
  { key: 'birthday', label: 'Birthday' },
  { key: 'corporate', label: 'Corporate' },
  { key: 'wedding', label: 'Wedding' },
  { key: 'house_party', label: 'House Party' },
];

export default function CreateCateringServicePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { masterData, locations } = useOnboardingMasterDataContext();
  const { getExperienceTypesForService } = useServiceCatalogMetaContext();
  const [form, setForm] = useState<CateringForm>(DEFAULT_FORM);
  const [activeStep, setActiveStep] = useState<StepKey>('basic');
  const [areaInput, setAreaInput] = useState('');
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
  const createMenuSection = useCreatePartnerServiceMenuSection();
  const createMenuItem = useCreatePartnerServiceMenuItem();
  const createAddon = useCreatePartnerServiceAddon();

  const cityOptions = useMemo(() => getAllCities(locations), [locations]);
  const currencies = useMemo(
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
  const experiences = useMemo(
    () =>
      getExperienceTypesForService('catering').filter((item) => item.is_active),
    [getExperienceTypesForService]
  );
  const cuisineOptions = masterData?.cuisines || fallbackCuisineOptions;
  const dietTypeOptions = masterData?.diet_types || fallbackDietTypeOptions;
  const serviceStyleOptions =
    masterData?.service_styles || fallbackServiceStyleOptions;
  const eventTypeOptions = masterData?.event_types || fallbackEventTypeOptions;
  const serviceAreaOptions = selectedCity?.serviceAreas || [];
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
    createMenuSection.isPending ||
    createMenuItem.isPending ||
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
  const toggleArray = <K extends keyof CateringForm>(key: K, value: string) =>
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
        error instanceof Error
          ? error.message
          : 'Unable to upload catering image.'
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
      console.error('Failed to delete catering image:', error);
    }
  };

  const goNext = () => {
    const next = steps[Math.min(activeIndex + 1, steps.length - 1)];
    setActiveStep(next.key);
  };

  const goBack = () => {
    if (activeIndex === 0) {
      router.push('/partner/services');
      return;
    }
    setActiveStep(steps[activeIndex - 1].key);
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setSubmitError('');
    try {
      const created = await createService.mutateAsync(
        buildCreateCateringPayload(form, serviceAreaOptions)
      );
      for (const item of normalizePackages(form.packages))
        await createPricingTier.mutateAsync({
          serviceId: created.id,
          min_guests: item.min_guests,
          max_guests: item.max_guests,
          price: item.price,
          price_unit: item.price_unit,
        });
      for (const section of normalizeSections(form.sections)) {
        const createdSection = await createMenuSection.mutateAsync({
          serviceId: created.id,
          key: section.key,
          label: section.label,
          min_select: section.min_select,
          max_select: section.max_select,
          is_required: section.is_required,
          sort_order: section.sort_order,
        });
        for (const item of section.items)
          await createMenuItem.mutateAsync({
            serviceId: created.id,
            section_id: createdSection.id,
            name: item.name,
            description: item.description,
            food_type: item.food_type || undefined,
            is_included: item.is_included,
            extra_price: item.extra_price,
            price_unit: item.price_unit,
            is_active: true,
            sort_order: item.sort_order,
          });
      }
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
          : 'Unable to create catering service. Please try again.'
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
          <h1 style={styles.title}>Add Catering Offering</h1>
          <p style={styles.subtitle}>
            Set up your catering service details. You can edit later anytime.
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
          {activeStep === 'basic' && (
            <BasicStep
              form={form}
              update={update}
              toggleArray={toggleArray}
              experiences={experiences}
              cuisineOptions={cuisineOptions}
              dietTypeOptions={dietTypeOptions}
              eventTypeOptions={eventTypeOptions}
              images={form.images}
              uploadingMedia={uploadingMedia}
              mediaUploadError={mediaUploadError}
              onUpload={uploadServiceImages}
              onRemove={removeImage}
            />
          )}
          {activeStep === 'menu' && <MenuBuilder form={form} update={update} />}
          {activeStep === 'packages' && (
            <PricingPackages
              form={form}
              update={update}
              currencySymbol={currencySymbol}
            />
          )}
          {activeStep === 'pricing' && (
            <PricingStep
              form={form}
              update={update}
              currencies={currencies}
              serviceStyleOptions={serviceStyleOptions}
            />
          )}
          {activeStep === 'delivery' && (
            <DeliveryStep
              form={form}
              update={update}
              toggleArray={toggleArray}
              cityOptions={cityOptions}
              locations={locations}
              serviceAreaOptions={serviceAreaOptions}
              areaInput={areaInput}
              setAreaInput={setAreaInput}
            />
          )}
          {activeStep === 'review' && (
            <ReviewStep
              form={form}
              currencySymbol={currencySymbol}
              cuisineOptions={cuisineOptions}
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
                {isSubmitting ? 'Publishing...' : 'Publish Catering Offering'}
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
          <CateringPreview
            form={form}
            currencySymbol={currencySymbol}
            cuisineOptions={cuisineOptions}
            stepValidity={stepValidity}
          />
        </aside>
      </div>
    </div>
  );
}

function BasicStep({
  form,
  update,
  toggleArray,
  experiences,
  cuisineOptions,
  dietTypeOptions,
  eventTypeOptions,
  images,
  uploadingMedia,
  mediaUploadError,
  onUpload,
  onRemove,
}: {
  form: CateringForm;
  update: Updater;
  toggleArray: <K extends keyof CateringForm>(key: K, value: string) => void;
  experiences: SelectOption[];
  cuisineOptions: SelectOption[];
  dietTypeOptions: SelectOption[];
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
      subtitle="Give customers a clear reason to trust and request your catering service."
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
                <option value="event_catering">Event Catering</option>
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
        label="Event types you cater"
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
      <TagBlock
        label="Diet options"
        required
        options={dietTypeOptions}
        selected={form.dietTypes}
        onToggle={(key) => toggleArray('dietTypes', key)}
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

function PricingStep({
  form,
  update,
  currencies,
  serviceStyleOptions,
}: {
  form: CateringForm;
  update: Updater;
  currencies: { code: string; label: string }[];
  serviceStyleOptions: SelectOption[];
}) {
  const toggleStyle = (key: string) =>
    update(
      'serviceStyles',
      form.serviceStyles.includes(key)
        ? form.serviceStyles.filter((item) => item !== key)
        : [...form.serviceStyles, key]
    );
  return (
    <Panel
      title="Service & Pricing"
      subtitle="Keep the commercial rules simple. Catering works best as a quote-led service."
    >
      <div style={styles.optionGrid}>
        <OptionButton
          active={form.bookingType === 'quote'}
          title="Quote request"
          text="Collect event needs first, then confirm price."
          onClick={() => update('bookingType', 'quote')}
        />
        <OptionButton
          active={form.bookingType === 'request_only'}
          title="Request only"
          text="Use when every booking needs manual review."
          onClick={() => update('bookingType', 'request_only')}
        />
      </div>
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
        <Field label="Maximum guests">
          <input
            type="number"
            value={form.maxGuests}
            onChange={(e) => update('maxGuests', e.target.value)}
            style={styles.input}
          />
        </Field>
      </div>
      <TagBlock
        label="Service style"
        options={serviceStyleOptions}
        selected={form.serviceStyles}
        onToggle={toggleStyle}
      />
      <AddonsBuilder form={form} update={update} />
    </Panel>
  );
}

function DeliveryStep({
  form,
  update,
  toggleArray,
  cityOptions,
  locations,
  serviceAreaOptions,
  areaInput,
  setAreaInput,
}: {
  form: CateringForm;
  update: Updater;
  toggleArray: <K extends keyof CateringForm>(key: K, value: string) => void;
  cityOptions: City[];
  locations: { countries: Country[] } | undefined;
  serviceAreaOptions: ServiceArea[];
  areaInput: string;
  setAreaInput: (value: string) => void;
}) {
  return (
    <Panel
      title="Delivery & Area"
      subtitle="Choose where customers can book this catering offering."
    >
      <div style={styles.grid2}>
        <Field label="City" required>
          <CitySelect
            value={form.cityId}
            fallbackCity={form.city || 'Select city'}
            cityOptions={cityOptions}
            onChange={(nextCity) => {
              const country = findCountryByCity(
                locations,
                nextCity?.id || '',
                nextCity?.name || ''
              );
              update('cityId', nextCity?.id || '');
              update('city', nextCity?.name || form.city);
              update(
                'currencyCode',
                country?.currencyCode || form.currencyCode
              );
              update('areas', []);
            }}
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
      <Field label="Add location or PIN code">
        <div style={styles.inlineInput}>
          <input
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value)}
            style={styles.input}
            placeholder="Example: Jubilee Hills or 500033"
          />
          <button
            type="button"
            style={styles.inlineAddButton}
            onClick={() => {
              const value = areaInput.trim();
              if (!value) return;
              if (!form.areas.includes(value))
                update('areas', [...form.areas, value]);
              setAreaInput('');
            }}
          >
            Add
          </button>
        </div>
      </Field>
      <TagBlock
        label="Service areas"
        required
        options={[
          ...new Set([
            ...serviceAreaOptions.map((area) => area.name),
            ...form.areas,
          ]),
        ].map((name) => ({ key: name, label: name }))}
        selected={form.areas}
        onToggle={(key) => toggleArray('areas', key)}
      />
    </Panel>
  );
}

function PricingPackages({
  form,
  update,
  currencySymbol,
}: {
  form: CateringForm;
  update: Updater;
  currencySymbol: string;
}) {
  return (
    <Panel
      title="Create Packages"
      subtitle="Packages are saved as pricing tiers. Use names like Executive Thali, Premium Buffet, or Corporate Lunch."
    >
      <div style={styles.packageLayout}>
        <div style={styles.packageRail}>
          {form.packages.map((item, index) => (
            <button key={item.id} type="button" style={styles.packageTab}>
              {item.name || `Package ${index + 1}`}
            </button>
          ))}
          <button
            type="button"
            style={styles.addPackageBtn}
            onClick={() =>
              update('packages', [
                ...form.packages,
                {
                  id: `package-${Date.now()}`,
                  name: `Package ${form.packages.length + 1}`,
                  description: '',
                  minGuests: form.maxGuests || '50',
                  maxGuests: '',
                  price: '',
                  priceUnit: 'per_guest',
                },
              ])
            }
          >
            Add Package
          </button>
        </div>
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
                <Field label="Price unit" required>
                  <PriceUnitSelect
                    value={item.priceUnit}
                    values={['per_guest', 'per_plate', 'flat']}
                    onChange={(value) =>
                      updatePackage(form, update, item.id, {
                        priceUnit: value as PricingPackageDraft['priceUnit'],
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
                    placeholder="No limit"
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
      </div>
    </Panel>
  );
}

function MenuBuilder({
  form,
  update,
}: {
  form: CateringForm;
  update: Updater;
}) {
  return (
    <Panel
      title="Global Menu"
      subtitle="Create your master menu. You can reuse items in different packages."
    >
      <div style={styles.stack}>
        {form.sections.map((section, sectionIndex) => (
          <div key={section.id} style={styles.nestedCard}>
            <CardHeader
              title={`${section.label || 'Menu section'} (${section.items.length} items)`}
              onRemove={
                form.sections.length > 1
                  ? () =>
                      update(
                        'sections',
                        form.sections.filter((item) => item.id !== section.id)
                      )
                  : undefined
              }
            />
            <div style={styles.grid3}>
              <Field label="Section name" required>
                <input
                  value={section.label}
                  onChange={(e) =>
                    updateSection(form, update, section.id, {
                      label: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
              <Field label="Min choices">
                <input
                  type="number"
                  value={section.minSelect}
                  onChange={(e) =>
                    updateSection(form, update, section.id, {
                      minSelect: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </Field>
              <Field label="Max choices">
                <input
                  type="number"
                  value={section.maxSelect}
                  onChange={(e) =>
                    updateSection(form, update, section.id, {
                      maxSelect: e.target.value,
                    })
                  }
                  style={styles.input}
                  placeholder="No limit"
                />
              </Field>
            </div>
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={section.isRequired}
                onChange={(e) =>
                  updateSection(form, update, section.id, {
                    isRequired: e.target.checked,
                  })
                }
              />
              Required in every package
            </label>
            <div style={styles.menuItems}>
              {section.items.map((item, itemIndex) => (
                <div key={item.id} style={styles.itemCard}>
                  <CardHeader
                    title={`Item ${itemIndex + 1}`}
                    onRemove={
                      section.items.length > 1
                        ? () =>
                            updateSection(form, update, section.id, {
                              items: section.items.filter(
                                (row) => row.id !== item.id
                              ),
                            })
                        : undefined
                    }
                  />
                  <div style={styles.grid2}>
                    <Field label="Item name" required>
                      <input
                        value={item.name}
                        onChange={(e) =>
                          updateMenuItem(form, update, section.id, item.id, {
                            name: e.target.value,
                          })
                        }
                        style={styles.input}
                      />
                    </Field>
                    <Field label="Food type">
                      <FoodTypeSelect
                        value={item.foodType}
                        onChange={(value) =>
                          updateMenuItem(form, update, section.id, item.id, {
                            foodType: value,
                          })
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <input
                      value={item.description}
                      onChange={(e) =>
                        updateMenuItem(form, update, section.id, item.id, {
                          description: e.target.value,
                        })
                      }
                      style={styles.input}
                    />
                  </Field>
                  <div style={styles.grid3}>
                    <label style={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={item.isIncluded}
                        onChange={(e) =>
                          updateMenuItem(form, update, section.id, item.id, {
                            isIncluded: e.target.checked,
                          })
                        }
                      />
                      Included
                    </label>
                    <Field label="Extra price">
                      <input
                        type="number"
                        value={item.extraPrice}
                        onChange={(e) =>
                          updateMenuItem(form, update, section.id, item.id, {
                            extraPrice: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Extra unit">
                      <PriceUnitSelect
                        value={item.priceUnit}
                        values={['per_guest', 'per_item', 'flat']}
                        onChange={(value) =>
                          updateMenuItem(form, update, section.id, item.id, {
                            priceUnit: value as MenuItemDraft['priceUnit'],
                          })
                        }
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
                updateSection(form, update, section.id, {
                  items: [...section.items, createEmptyMenuItem()],
                })
              }
            >
              Add item
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        style={styles.inlineAddButton}
        onClick={() =>
          update('sections', [
            ...form.sections,
            {
              id: `section-${Date.now()}`,
              label: '',
              minSelect: '0',
              maxSelect: '',
              isRequired: false,
              items: [createEmptyMenuItem()],
            },
          ])
        }
      >
        Add section
      </button>
    </Panel>
  );
}

function AddonsBuilder({
  form,
  update,
}: {
  form: CateringForm;
  update: Updater;
}) {
  return (
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
            <Field label="Add-on name" required>
              <input
                value={addon.label}
                onChange={(e) =>
                  updateAddon(form, update, addon.id, { label: e.target.value })
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
                  updateAddon(form, update, addon.id, { price: e.target.value })
                }
                style={styles.input}
                placeholder="0"
              />
            </Field>
          </div>
        </div>
      ))}
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
    </div>
  );
}

function ReviewStep({
  form,
  currencySymbol,
  cuisineOptions,
  onEdit,
}: {
  form: CateringForm;
  currencySymbol: string;
  cuisineOptions: SelectOption[];
  onEdit: (step: StepKey) => void;
}) {
  const cuisineLabelByKey = new Map(
    cuisineOptions.map((item) => [item.key, item.label])
  );
  return (
    <Panel
      title="Review Your Catering Offering"
      subtitle="Please review all details before publishing."
    >
      <div style={styles.reviewGrid}>
        <ReviewCard
          title="Basic Information"
          onEdit={() => onEdit('basic')}
          items={[
            form.title,
            form.shortDescription,
            `${form.eventTypes.length} event types`,
            form.cuisines
              .map((item) => cuisineLabelByKey.get(item) || item)
              .join(', '),
          ]}
        />
        <ReviewCard
          title="Global Menu"
          onEdit={() => onEdit('menu')}
          items={[
            `${form.sections.length} sections`,
            `${normalizeSections(form.sections).reduce((total, section) => total + section.items.length, 0)} menu items`,
          ]}
        />
        <ReviewCard
          title="Packages"
          onEdit={() => onEdit('packages')}
          items={form.packages.map((item) => item.name)}
        />
        <ReviewCard
          title="Service & Pricing"
          onEdit={() => onEdit('pricing')}
          items={[
            `${currencySymbol}${normalizePackages(form.packages)[0]?.price || 0} starting`,
            `${form.addons.length} add-ons`,
            form.bookingType === 'quote' ? 'Quote request' : 'Request only',
          ]}
        />
        <ReviewCard
          title="Delivery & Area"
          onEdit={() => onEdit('delivery')}
          items={[
            `${form.areas.length} areas`,
            form.city,
            `${form.advanceNoticeHours} hours notice`,
          ]}
        />
      </div>
    </Panel>
  );
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

function buildCreateCateringPayload(
  form: CateringForm,
  serviceAreaOptions: ServiceArea[]
): PartnerServicePayload {
  const packages = normalizePackages(form.packages);
  const selectedServiceAreas = form.areas.map((areaName) => {
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
      radius_km: matchedArea?.radiusKm || null,
    };
  });
  return {
    service_key: 'catering',
    experience_type_key: form.experienceTypeKey || 'event_catering',
    title: form.title.trim(),
    short_description: form.shortDescription.trim(),
    description: form.description.trim(),
    booking_type: form.bookingType,
    pricing_model: 'package',
    base_price: packages[0]?.price ?? null,
    currency_code: form.currencyCode,
    min_guests: toNumberOrNull(form.minGuests),
    max_guests: toNumberOrNull(form.maxGuests),
    advance_notice_hours: toNumberOrNull(form.advanceNoticeHours) || 48,
    service_areas: selectedServiceAreas,
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
      cuisines: form.cuisines,
      diet_types: form.dietTypes,
      service_styles: form.serviceStyles,
      event_types: form.eventTypes,
      packages: packages.map((item, index) => ({
        ...item,
        key: slugify(item.name, `package_${index + 1}`),
      })),
      menu_summary: normalizeSections(form.sections).map((section) => ({
        key: section.key,
        label: section.label,
        item_count: section.items.length,
        is_required: section.is_required,
      })),
      city: form.city,
      city_id: form.cityId || null,
      location_model: 'service_area',
    },
    is_active: true,
  };
}

function getStepValidity(
  form: CateringForm,
  currencies: { code: string }[]
): Record<StepKey, boolean> {
  const knownCurrency =
    currencies.length === 0 ||
    currencies.some((item) => item.code === form.currencyCode);
  return {
    basic: Boolean(
      form.title.trim() &&
      form.shortDescription.trim() &&
      form.description.trim() &&
      form.experienceTypeKey &&
      form.cuisines.length > 0 &&
      form.dietTypes.length > 0
    ),
    menu: normalizeSections(form.sections).length > 0,
    packages: normalizePackages(form.packages).length > 0,
    pricing: Boolean(
      Number(form.minGuests) > 0 &&
      (!form.maxGuests || Number(form.maxGuests) >= Number(form.minGuests)) &&
      isValidCurrencyCode(form.currencyCode) &&
      knownCurrency
    ),
    delivery: Boolean(form.city.trim() && form.areas.length > 0),
    review: true,
  };
}

function normalizePackages(packages: PricingPackageDraft[]) {
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
function normalizeSections(sections: MenuSectionDraft[]) {
  return sections
    .map((section, sectionIndex) => ({
      key: slugify(section.label, `section_${sectionIndex + 1}`),
      label: section.label.trim(),
      min_select: toNumberOrNull(section.minSelect) || 0,
      max_select: toNumberOrNull(section.maxSelect),
      is_required: section.isRequired,
      sort_order: sectionIndex,
      items: section.items
        .map((item, itemIndex) => ({
          name: item.name.trim(),
          description: item.description.trim(),
          food_type: item.foodType,
          is_included: item.isIncluded,
          extra_price: toNumberOrNull(item.extraPrice) || 0,
          price_unit: item.priceUnit,
          sort_order: itemIndex,
        }))
        .filter((item) => item.name),
    }))
    .filter((section) => section.label && section.items.length > 0);
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
  form: CateringForm,
  update: Updater,
  id: string,
  patch: Partial<PricingPackageDraft>
) {
  update(
    'packages',
    form.packages.map((item) => (item.id === id ? { ...item, ...patch } : item))
  );
}
function updateSection(
  form: CateringForm,
  update: Updater,
  id: string,
  patch: Partial<MenuSectionDraft>
) {
  update(
    'sections',
    form.sections.map((item) => (item.id === id ? { ...item, ...patch } : item))
  );
}
function updateMenuItem(
  form: CateringForm,
  update: Updater,
  sectionId: string,
  itemId: string,
  patch: Partial<MenuItemDraft>
) {
  update(
    'sections',
    form.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, ...patch } : item
            ),
          }
        : section
    )
  );
}
function updateAddon(
  form: CateringForm,
  update: Updater,
  id: string,
  patch: Partial<AddonDraft>
) {
  update(
    'addons',
    form.addons.map((item) => (item.id === id ? { ...item, ...patch } : item))
  );
}
function createEmptyMenuItem(): MenuItemDraft {
  return {
    id: `item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: '',
    description: '',
    foodType: '',
    isIncluded: true,
    extraPrice: '',
    priceUnit: 'per_guest',
  };
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
  if (value === 'per_plate') return 'per plate';
  if (value === 'per_item') return 'per item';
  return 'flat';
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
function FoodTypeSelect({
  value,
  onChange,
}: {
  value: MenuItemDraft['foodType'];
  onChange: (value: MenuItemDraft['foodType']) => void;
}) {
  return (
    <SelectWrap>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as MenuItemDraft['foodType'])}
        style={styles.select}
      >
        <option value="">Not specified</option>
        <option value="veg">Veg</option>
        <option value="non_veg">Non-Veg</option>
        <option value="vegan">Vegan</option>
        <option value="egg">Egg</option>
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
            <img src={image.url} alt="Catering service" style={styles.image} />
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
          <small>Food, buffet, packaging, setup, or event photos</small>
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
function CateringPreview({
  form,
  currencySymbol,
  cuisineOptions,
  stepValidity,
}: {
  form: CateringForm;
  currencySymbol: string;
  cuisineOptions: SelectOption[];
  stepValidity: Record<StepKey, boolean>;
}) {
  const cuisineLabelByKey = new Map(
    cuisineOptions.map((item) => [item.key, item.label])
  );
  const firstPackage = normalizePackages(form.packages)[0];
  const sections = normalizeSections(form.sections);
  const itemCount = sections.reduce(
    (total, section) => total + section.items.length,
    0
  );
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
          <div style={styles.previewCoverPlaceholder}>No service photo yet</div>
        )}
      </div>
      <div style={styles.previewBody}>
        <h2 style={styles.previewTitle}>
          {form.title || 'Catering Service Title'}
        </h2>
        <p style={styles.previewDesc}>{form.shortDescription}</p>
        <div style={styles.previewTags}>
          {form.eventTypes.slice(0, 3).map((item) => (
            <span key={item} style={styles.previewTag}>
              {item}
            </span>
          ))}
          {form.cuisines.slice(0, 3).map((item) => (
            <span key={item} style={styles.previewTag}>
              {cuisineLabelByKey.get(item) || item}
            </span>
          ))}
        </div>
        <div style={styles.previewInfo}>
          <PreviewRow label="Experience" value="8+ years" />
          <PreviewRow
            label="Starting at"
            value={
              firstPackage
                ? `${currencySymbol}${firstPackage.price} ${formatPriceUnit(firstPackage.price_unit)}`
                : 'Add pricing'
            }
          />
          <PreviewRow
            label="Global menu"
            value={`${sections.length} sections - ${itemCount} items`}
          />
          <PreviewRow
            label="Packages"
            value={`${form.packages.length} packages`}
          />
          <PreviewRow
            label="Delivery & area"
            value={`${form.areas.length} areas - ${form.city || 'City'}`}
          />
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
  stepActive: { color: '#2f8f3a' },
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
    color: '#2f8f3a',
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
  packageLayout: {
    display: 'grid',
    gridTemplateColumns: '180px minmax(0, 1fr)',
    gap: 14,
  },
  packageRail: {
    border: '1px solid #edf0f5',
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignSelf: 'start',
  },
  packageTab: {
    minHeight: 38,
    border: '1px solid #e0e5ec',
    borderRadius: 8,
    background: '#ffffff',
    color: '#374151',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  addPackageBtn: {
    minHeight: 38,
    border: 'none',
    borderRadius: 8,
    background: '#43a047',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  nestedCard: {
    border: '1px solid #e6e9f0',
    borderRadius: 10,
    padding: 14,
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  itemCard: {
    border: '1px solid #edf0f5',
    borderRadius: 10,
    padding: 12,
    background: '#fbfcff',
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
    color: '#2f8f3a',
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
    color: '#2f8f3a',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    padding: '0 13px',
    alignSelf: 'flex-start',
  },
  inlineInput: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: 8,
  },
  checkboxRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#374151',
    fontSize: 13,
    fontWeight: 600,
  },
  menuItems: { display: 'flex', flexDirection: 'column', gap: 12 },
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
    color: '#2f8f3a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 5,
    padding: 14,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
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
    color: '#2f8f3a',
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
    color: '#2f8f3a',
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
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
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
