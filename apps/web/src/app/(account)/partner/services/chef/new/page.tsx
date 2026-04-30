'use client';

import React, { useMemo, useState } from 'react';
import {
  ServicesIcon,
  CalendarIcon,
  EarningsIcon,
  ApprovalIcon,
  EditIcon,
  RejectIcon,
} from '@/components/Icons/DashboardIcons';
import StatusBadge from '@/components/dashboard/StatusBadge';

type FoodType = 'veg' | 'non_veg' | 'both';
type ServiceType = 'customer_home' | 'my_kitchen' | 'both';

type ChefProfile = {
  name: string;
  avatarUrl: string;
  experience: string;
  cuisines: string[];
  city: string;
};

type ChefServiceForm = {
  title: string;
  description: string;
  cuisines: string[];
  foodType: FoodType;
  serviceType: ServiceType;
  days: string[];
  slots: string[];
  pricePerMeal: string;
  sessionPrice: string;
  weeklyPrice: string;
  monthlyPrice: string;
  city: string;
  areas: string[];
  radiusKm: number;
  images: string[];
};

const DEFAULT_PROFILE: ChefProfile = {
  name: 'Anjali Sharma',
  avatarUrl: '/dashboard/chef-service.png',
  experience: '5+ Years',
  cuisines: ['North Indian', 'South Indian', 'Jain'],
  city: 'Hyderabad',
};

const DEFAULT_FORM: ChefServiceForm = {
  title: 'Home Chef for Daily Meals',
  description:
    'Fresh, hygienic home-style meals prepared with care for families, professionals, and elderly customers.',
  cuisines: ['North Indian', 'South Indian'],
  foodType: 'veg',
  serviceType: 'customer_home',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  slots: ['Lunch', 'Dinner'],
  pricePerMeal: '250',
  sessionPrice: '1200',
  weeklyPrice: '5500',
  monthlyPrice: '18000',
  city: 'Hyderabad',
  areas: ['Jubilee Hills', 'Madhapur', 'Kondapur'],
  radiusKm: 12,
  images: [
    '/dashboard/chef-service.png',
    '/dashboard/meal-plan.png',
    '/dashboard/catering.png',
  ],
};

const cuisineOptions = [
  'North Indian',
  'South Indian',
  'Jain',
  'Gujarati',
  'Punjabi',
  'Bengali',
  'Telugu',
  'Healthy',
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const slots = ['Breakfast', 'Lunch', 'Dinner', 'Evening Snacks'];
const areas = [
  'Jubilee Hills',
  'Banjara Hills',
  'Madhapur',
  'Hitech City',
  'Kondapur',
  'Gachibowli',
];

export default function CreateChefServicePage({
  profile = DEFAULT_PROFILE,
  onBack,
  onSubmit,
}: {
  profile?: ChefProfile;
  onBack?: () => void;
  onSubmit?: (payload: ChefServiceForm) => void;
}) {
  const [form, setForm] = useState<ChefServiceForm>(DEFAULT_FORM);
  const [areaInput, setAreaInput] = useState('');

  const isValid = useMemo(() => {
    return (
      form.title.trim() &&
      form.description.trim() &&
      form.cuisines.length > 0 &&
      form.days.length > 0 &&
      form.slots.length > 0 &&
      form.pricePerMeal.trim() &&
      form.city.trim() &&
      form.areas.length > 0
    );
  }, [form]);

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

  const addMockImage = () => {
    const samples = [
      '/dashboard/chef-service.png',
      '/dashboard/meal-plan.png',
      '/dashboard/catering.png',
    ];

    update('images', [...form.images, samples[form.images.length % 3]]);
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
            profile={profile}
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
                <select
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  style={styles.input}
                >
                  <option>Hyderabad</option>
                  <option>Bengaluru</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Chennai</option>
                  <option>Pune</option>
                </select>
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
                    key={item}
                    label={item}
                    selected={form.cuisines.includes(item)}
                    onClick={() => toggleArray('cuisines', item)}
                  />
                ))}
              </ChipGrid>
            </div>
          </Section>

          <Section
            title="Service configuration"
            subtitle="Choose food preference and where you provide the service."
          >
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
            title="Pricing"
            subtitle="Set simple pricing. You can improve pricing rules later."
          >
            <div style={styles.grid2}>
              <Field label="Price per meal" required>
                <input
                  value={form.pricePerMeal}
                  onChange={(e) => update('pricePerMeal', e.target.value)}
                  style={styles.input}
                  placeholder="250"
                />
              </Field>

              <Field label="Session price">
                <input
                  value={form.sessionPrice}
                  onChange={(e) => update('sessionPrice', e.target.value)}
                  style={styles.input}
                  placeholder="1200"
                />
              </Field>

              <Field label="Weekly package">
                <input
                  value={form.weeklyPrice}
                  onChange={(e) => update('weeklyPrice', e.target.value)}
                  style={styles.input}
                  placeholder="5500"
                />
              </Field>

              <Field label="Monthly package">
                <input
                  value={form.monthlyPrice}
                  onChange={(e) => update('monthlyPrice', e.target.value)}
                  style={styles.input}
                  placeholder="18000"
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Service area"
            subtitle="Choose areas where customers can book this service."
          >
            <div style={styles.grid2}>
              <Field label="City" required>
                <select
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  style={styles.input}
                >
                  <option>Hyderabad</option>
                  <option>Bengaluru</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Chennai</option>
                  <option>Pune</option>
                </select>
              </Field>

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
            </div>

            <div style={styles.block}>
              <Label required>Selected service areas</Label>

              <ChipGrid>
                {[...new Set([...areas, ...form.areas])].map((area) => (
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
          </Section>

          <Section
            title="Service images"
            subtitle="Add food, kitchen, or chef work photos for this service."
          >
            <ServiceImageGallery
              images={form.images}
              onAdd={addMockImage}
              onRemove={removeImage}
            />
          </Section>

          <div style={styles.actions}>
            <button type="button" onClick={onBack} style={styles.secondaryBtn}>
              Cancel
            </button>

            <button
              type="button"
              disabled={!isValid}
              onClick={() => onSubmit?.(form)}
              style={{
                ...styles.primaryBtn,
                ...(!isValid ? styles.disabledBtn : {}),
              }}
            >
              Submit for Review →
            </button>
          </div>
        </main>

        <aside style={styles.right}>
          <ChefServicePreview profile={profile} form={form} />
        </aside>
      </div>
    </div>
  );
}

function ChefServicePreview({
  profile,
  form,
}: {
  profile: ChefProfile;
  form: ChefServiceForm;
}) {
  return (
    <div style={styles.preview}>
      <div style={styles.previewHeader}>
        <span>Live preview</span>
        <StatusBadge status="under_review" label="Draft" />
      </div>

      <div style={styles.previewCover}>
        <img
          src={form.images[0] || '/dashboard/chef-service.png'}
          alt={form.title}
          style={styles.previewCoverImg}
        />
      </div>

      <div style={styles.previewBody}>
        <div style={styles.previewProfile}>
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            style={styles.previewAvatar}
          />

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
              {item}
            </span>
          ))}
        </div>

        <div style={styles.previewInfo}>
          <PreviewRow label="Food type" value={formatFoodType(form.foodType)} />
          <PreviewRow
            label="Service"
            value={formatServiceType(form.serviceType)}
          />
          <PreviewRow
            label="Availability"
            value={`${form.days.length} days · ${form.slots.join(', ')}`}
          />
          <PreviewRow label="Pricing" value={`₹${form.pricePerMeal} / meal`} />
          <PreviewRow
  label="Area"
  value={`${form.areas.length} selected · ${form.city}`}
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
  onAdd,
  onRemove,
}: {
  images: string[];
  onAdd: () => void;
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

        <button type="button" onClick={onAdd} style={styles.addImageTile}>
          + Add photo
          <small>Food, kitchen or work photo</small>
        </button>
      </div>

      <p style={styles.helper}>
        For MVP this can use uploaded URLs later. UI is ready for Supabase
        storage or S3.
      </p>
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

function formatServiceType(value: ServiceType) {
  if (value === 'customer_home') return "Customer's home";
  if (value === 'my_kitchen') return 'My kitchen';
  return 'Home or kitchen';
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
