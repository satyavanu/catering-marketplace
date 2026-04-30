'use client';

import React, { useMemo, useState } from 'react';
import {
  ServicesIcon,
  CalendarIcon,
  EarningsIcon,
  ApprovalIcon,
} from '@/components/Icons/DashboardIcons';
import StatusBadge from '@/components/dashboard/StatusBadge';

type StepKey = 1 | 2 | 3 | 4 | 5;

type ChefServiceForm = {
  title: string;
  description: string;
  experience: string;
  cuisines: string[];
  foodType: 'veg' | 'non_veg' | 'both';
  serviceType: 'customer_home' | 'my_kitchen' | 'both';
  days: string[];
  slots: string[];
  pricePerMeal: string;
  weeklyPlanPrice: string;
  monthlyPlanPrice: string;
  city: string;
  areas: string[];
  radiusKm: number;
};

const initialForm: ChefServiceForm = {
  title: 'Home Chef for Daily Meals',
  description:
    'I provide hygienic, home-style meals with a focus on taste and nutrition.',
  experience: '5+ Years',
  cuisines: ['North Indian', 'South Indian', 'Jain'],
  foodType: 'veg',
  serviceType: 'customer_home',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  slots: ['Morning', 'Lunch'],
  pricePerMeal: '250',
  weeklyPlanPrice: '1200',
  monthlyPlanPrice: '4500',
  city: 'Hyderabad',
  areas: ['Jubilee Hills', 'Banjara Hills', 'Madhapur'],
  radiusKm: 15,
};

const steps = [
  'Basic Info',
  'Availability',
  'Pricing',
  'Service Area',
  'Preview',
];

const cuisineOptions = [
  'North Indian',
  'South Indian',
  'Jain',
  'Gujarati',
  'Punjabi',
  'Bengali',
  'Rajasthani',
  'Other',
];

const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const slotOptions = ['Morning', 'Lunch', 'Evening', 'Night'];
const areaOptions = [
  'Jubilee Hills',
  'Banjara Hills',
  'Madhapur',
  'Hitech City',
  'Gachibowli',
  'Kondapur',
];

export default function AddChefServiceFlow({
  onBack,
  onSubmit,
}: {
  onBack?: () => void;
  onSubmit?: (data: ChefServiceForm) => void;
}) {
  const [step, setStep] = useState<StepKey>(1);
  const [form, setForm] = useState<ChefServiceForm>(initialForm);

  const canContinue = useMemo(() => {
    if (step === 1) {
      return (
        form.title.trim() &&
        form.description.trim() &&
        form.cuisines.length > 0 &&
        form.foodType &&
        form.serviceType
      );
    }

    if (step === 2) return form.days.length > 0 && form.slots.length > 0;
    if (step === 3) return form.pricePerMeal.trim();
    if (step === 4) return form.city.trim() && form.areas.length > 0;

    return true;
  }, [form, step]);

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

  const goNext = () => {
    if (!canContinue) return;

    if (step === 5) {
      onSubmit?.(form);
      return;
    }

    setStep((prev) => (prev + 1) as StepKey);
  };

  return (
    <div style={styles.page}>
      <button type="button" onClick={onBack} style={styles.backButton}>
        ← Back
      </button>

      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <ServicesIcon size={26} />
        </div>

        <div>
          <h1 style={styles.title}>Add Chef Service</h1>
          <p style={styles.subtitle}>
            Set up your chef service. You can edit this anytime.
          </p>
        </div>
      </div>

      <Stepper activeStep={step} />

      <div style={styles.layout}>
        <main style={styles.formColumn}>
          {step === 1 && (
            <StepBasicInfo
              form={form}
              update={update}
              toggleArray={toggleArray}
            />
          )}

          {step === 2 && (
            <StepAvailability
              form={form}
              toggleArray={toggleArray}
            />
          )}

          {step === 3 && (
            <StepPricing
              form={form}
              update={update}
            />
          )}

          {step === 4 && (
            <StepServiceArea
              form={form}
              update={update}
              toggleArray={toggleArray}
            />
          )}

          {step === 5 && <StepFinalPreview form={form} />}
        </main>

        <aside style={styles.previewColumn}>
          <ChefServicePreview form={form} />
        </aside>
      </div>

      <div style={styles.actions}>
        <button
          type="button"
          onClick={() => (step === 1 ? onBack?.() : setStep((step - 1) as StepKey))}
          style={styles.secondaryButton}
        >
          {step === 1 ? 'Cancel' : 'Previous'}
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canContinue}
          style={{
            ...styles.primaryButton,
            ...(!canContinue ? styles.disabledButton : {}),
          }}
        >
          {step === 5 ? 'Submit for Review' : 'Save & Continue'} →
        </button>
      </div>
    </div>
  );
}

function Stepper({ activeStep }: { activeStep: StepKey }) {
  return (
    <div style={styles.stepper}>
      {steps.map((label, index) => {
        const stepNo = (index + 1) as StepKey;
        const active = stepNo === activeStep;
        const completed = stepNo < activeStep;

        return (
          <React.Fragment key={label}>
            <div style={styles.stepItem}>
              <span
                style={{
                  ...styles.stepCircle,
                  ...(active ? styles.stepCircleActive : {}),
                  ...(completed ? styles.stepCircleCompleted : {}),
                }}
              >
                {completed ? '✓' : stepNo}
              </span>

              <span
                style={{
                  ...styles.stepLabel,
                  ...(active ? styles.stepLabelActive : {}),
                }}
              >
                {label}
              </span>
            </div>

            {index < steps.length - 1 && <span style={styles.stepLine} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepBasicInfo({
  form,
  update,
  toggleArray,
}: {
  form: ChefServiceForm;
  update: <K extends keyof ChefServiceForm>(
    key: K,
    value: ChefServiceForm[K]
  ) => void;
  toggleArray: <K extends keyof ChefServiceForm>(key: K, value: string) => void;
}) {
  return (
    <>
      <Card title="Basic Information">
        <div style={styles.twoColumn}>
          <Field label="Service Title" required>
            <input
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              style={styles.input}
            />
          </Field>

          <Field label="Short Description" required>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={4}
              maxLength={150}
              style={styles.textarea}
            />
            <p style={styles.counter}>{form.description.length}/150</p>
          </Field>

          <Field label="Experience">
            <select
              value={form.experience}
              onChange={(e) => update('experience', e.target.value)}
              style={styles.input}
            >
              <option>1+ Years</option>
              <option>3+ Years</option>
              <option>5+ Years</option>
              <option>10+ Years</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card title="Cuisines You Specialize In" required>
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

        <div style={styles.fieldBlock}>
          <p style={styles.sectionLabel}>Food Preference *</p>

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
      </Card>

      <Card title="Service Type" required subtitle="Where will you provide your service?">
        <div style={styles.serviceTypeGrid}>
          <OptionCard
            title="At Customer’s Home"
            text="I will cook at the customer’s home"
            selected={form.serviceType === 'customer_home'}
            onClick={() => update('serviceType', 'customer_home')}
          />
          <OptionCard
            title="At My Kitchen"
            text="Customer picks up from my kitchen"
            selected={form.serviceType === 'my_kitchen'}
            onClick={() => update('serviceType', 'my_kitchen')}
          />
          <OptionCard
            title="Both"
            text="I can cook at home or at my kitchen"
            selected={form.serviceType === 'both'}
            onClick={() => update('serviceType', 'both')}
          />
        </div>
      </Card>
    </>
  );
}

function StepAvailability({
  form,
  toggleArray,
}: {
  form: ChefServiceForm;
  toggleArray: <K extends keyof ChefServiceForm>(key: K, value: string) => void;
}) {
  return (
    <Card title="Set Your Availability" subtitle="Select days and slots when you are available.">
      <p style={styles.sectionLabel}>Available Days *</p>
      <ChipGrid>
        {dayOptions.map((day) => (
          <Chip
            key={day}
            label={day}
            selected={form.days.includes(day)}
            onClick={() => toggleArray('days', day)}
          />
        ))}
      </ChipGrid>

      <div style={styles.fieldBlock}>
        <p style={styles.sectionLabel}>Time Slots *</p>
        <div style={styles.slotGrid}>
          {slotOptions.map((slot) => (
            <OptionCard
              key={slot}
              title={slot}
              text={
                slot === 'Morning'
                  ? '06:00 AM - 12:00 PM'
                  : slot === 'Lunch'
                    ? '12:00 PM - 04:00 PM'
                    : slot === 'Evening'
                      ? '04:00 PM - 09:00 PM'
                      : '09:00 PM - 12:00 AM'
              }
              selected={form.slots.includes(slot)}
              onClick={() => toggleArray('slots', slot)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function StepPricing({
  form,
  update,
}: {
  form: ChefServiceForm;
  update: <K extends keyof ChefServiceForm>(
    key: K,
    value: ChefServiceForm[K]
  ) => void;
}) {
  return (
    <Card title="Set Your Pricing" subtitle="Define your basic chef service pricing.">
      <div style={styles.twoColumn}>
        <Field label="Price Per Meal" required>
          <input
            value={form.pricePerMeal}
            onChange={(e) => update('pricePerMeal', e.target.value)}
            style={styles.input}
            placeholder="₹ 250"
          />
        </Field>

        <Field label="Weekly Plan">
          <input
            value={form.weeklyPlanPrice}
            onChange={(e) => update('weeklyPlanPrice', e.target.value)}
            style={styles.input}
            placeholder="₹ 1200"
          />
        </Field>

        <Field label="Monthly Plan">
          <input
            value={form.monthlyPlanPrice}
            onChange={(e) => update('monthlyPlanPrice', e.target.value)}
            style={styles.input}
            placeholder="₹ 4500"
          />
        </Field>
      </div>
    </Card>
  );
}

function StepServiceArea({
  form,
  update,
  toggleArray,
}: {
  form: ChefServiceForm;
  update: <K extends keyof ChefServiceForm>(
    key: K,
    value: ChefServiceForm[K]
  ) => void;
  toggleArray: <K extends keyof ChefServiceForm>(key: K, value: string) => void;
}) {
  return (
    <Card title="Select Your Service Area" subtitle="Choose where you can provide service.">
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
        </select>
      </Field>

      <div style={styles.fieldBlock}>
        <p style={styles.sectionLabel}>Select Areas *</p>
        <ChipGrid>
          {areaOptions.map((area) => (
            <Chip
              key={area}
              label={area}
              selected={form.areas.includes(area)}
              onClick={() => toggleArray('areas', area)}
            />
          ))}
        </ChipGrid>
      </div>

      <div style={styles.fieldBlock}>
        <p style={styles.sectionLabel}>Maximum Distance: {form.radiusKm} km</p>
        <input
          type="range"
          min={5}
          max={25}
          value={form.radiusKm}
          onChange={(e) => update('radiusKm', Number(e.target.value))}
          style={styles.range}
        />
      </div>
    </Card>
  );
}

function StepFinalPreview({ form }: { form: ChefServiceForm }) {
  return (
    <Card title="Preview Your Chef Service" subtitle="Review your details before submitting.">
      <div style={styles.reviewGrid}>
        <Info label="Service" value={form.title} />
        <Info label="Experience" value={form.experience} />
        <Info label="Cuisines" value={form.cuisines.join(', ')} />
        <Info label="Food Type" value={formatFoodType(form.foodType)} />
        <Info label="Service Type" value={formatServiceType(form.serviceType)} />
        <Info label="Availability" value={`${form.days.join(', ')} · ${form.slots.join(', ')}`} />
        <Info label="Price" value={`₹${form.pricePerMeal} / meal`} />
        <Info label="Service Area" value={`${form.areas.join(', ')} · ${form.radiusKm} km`} />
      </div>

      <div style={styles.submitNote}>
        <ApprovalIcon size={18} />
        Your service will be submitted for review before going live.
      </div>
    </Card>
  );
}

function ChefServicePreview({ form }: { form: ChefServiceForm }) {
  return (
    <div style={styles.previewCard}>
      <div style={styles.previewHeader}>
        <ApprovalIcon size={16} />
        Preview
      </div>

      <div style={styles.previewBody}>
        <img
          src="/dashboard/chef-service.png"
          alt="Chef Preview"
          style={styles.previewImage}
        />

        <h2 style={styles.previewTitle}>{form.title || 'Chef Service Title'}</h2>
        <p style={styles.previewSub}>{form.experience} Experience</p>

        <div style={styles.previewTags}>
          {form.cuisines.slice(0, 3).map((item) => (
            <span key={item} style={styles.previewTag}>
              {item}
            </span>
          ))}
        </div>

        <p style={styles.previewDesc}>{form.description}</p>

        <div style={styles.previewDivider} />

        <PreviewRow label="Service Type" value={formatServiceType(form.serviceType)} />
        <PreviewRow
          label="Availability"
          value={form.days.length ? `${form.days.length} days · ${form.slots.join(', ')}` : 'Will be set next step'}
        />
        <PreviewRow
          label="Price"
          value={form.pricePerMeal ? `₹${form.pricePerMeal} / meal` : 'Will be set next step'}
        />
        <PreviewRow
          label="Service Area"
          value={form.areas.length ? `${form.areas.length} areas in ${form.city}` : 'Will be set next step'}
        />

        <div style={styles.visibleNote}>
          <StatusBadge status="approved" label="Visible after approval" />
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  required,
  children,
}: {
  title: string;
  subtitle?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.card}>
      <h2 style={styles.cardTitle}>
        {title} {required && <span style={styles.required}>*</span>}
      </h2>
      {subtitle && <p style={styles.cardSubtitle}>{subtitle}</p>}
      <div style={styles.cardBody}>{children}</div>
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
      {label} {selected && '✓'}
    </button>
  );
}

function OptionCard({
  title,
  text,
  selected,
  onClick,
}: {
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
        ...(selected ? styles.optionCardSelected : {}),
      }}
    >
      <strong>{title}</strong>
      <span>{text}</span>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoBox}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatFoodType(value: ChefServiceForm['foodType']) {
  if (value === 'veg') return 'Veg';
  if (value === 'non_veg') return 'Non-Veg';
  return 'Veg & Non-Veg';
}

function formatServiceType(value: ChefServiceForm['serviceType']) {
  if (value === 'customer_home') return "At Customer's Home";
  if (value === 'my_kitchen') return 'At My Kitchen';
  return 'At Home or Kitchen';
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
  },

  backButton: {
    alignSelf: 'flex-start',
    border: 'none',
    background: 'transparent',
    color: '#4b5563',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 999,
    background: 'linear-gradient(135deg, #4f9d35, #2f7d25)',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 24px rgba(63,155,63,0.18)',
  },

  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: '#151126',
    letterSpacing: '-0.03em',
  },

  subtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    color: '#64748b',
  },

  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },

  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 999,
    border: '1px solid #e5e7eb',
    color: '#64748b',
    background: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
  },

  stepCircleActive: {
    background: '#7c3aed',
    borderColor: '#7c3aed',
    color: '#ffffff',
  },

  stepCircleCompleted: {
    background: '#dcfce7',
    borderColor: '#dcfce7',
    color: '#15803d',
  },

  stepLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 600,
  },

  stepLabelActive: {
    color: '#151126',
  },

  stepLine: {
    width: 28,
    height: 1,
    background: '#e5e7eb',
  },

  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 330px',
    gap: 24,
    alignItems: 'start',
  },

  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    minWidth: 0,
  },

  previewColumn: {
    position: 'sticky',
    top: 20,
  },

  card: {
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 10px 28px rgba(17,24,39,0.035)',
  },

  cardTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: '#151126',
  },

  cardSubtitle: {
    margin: '6px 0 0',
    fontSize: 13,
    color: '#64748b',
  },

  cardBody: {
    marginTop: 18,
  },

  twoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: 18,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
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
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    padding: '0 12px',
    fontSize: 14,
    outline: 'none',
    background: '#ffffff',
  },

  textarea: {
    width: '100%',
    minHeight: 96,
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    padding: 12,
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
  },

  counter: {
    textAlign: 'right',
    margin: '-24px 12px 0 0',
    color: '#94a3b8',
    fontSize: 12,
  },

  fieldBlock: {
    marginTop: 22,
  },

  sectionLabel: {
    margin: '0 0 10px',
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
  },

  chipGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    minWidth: 120,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#334155',
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },

  chipSelected: {
    borderColor: '#65a34b',
    background: '#f0f9ec',
    color: '#2f7d25',
  },

  serviceTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 14,
  },

  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
  },

  optionCard: {
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    background: '#ffffff',
    padding: 16,
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    color: '#334155',
  },

  optionCardSelected: {
    borderColor: '#7c3aed',
    background: '#f8f4ff',
    color: '#5b21b6',
  },

  range: {
    width: '100%',
    accentColor: '#7c3aed',
  },

  previewCard: {
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 10px 28px rgba(17,24,39,0.035)',
  },

  previewHeader: {
    padding: '16px 18px',
    background: '#f8fbf6',
    borderBottom: '1px solid #eef4e9',
    color: '#2f7d25',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 700,
    fontSize: 14,
  },

  previewBody: {
    padding: 20,
    textAlign: 'center',
  },

  previewImage: {
    width: 86,
    height: 86,
    borderRadius: 999,
    objectFit: 'cover',
    marginBottom: 14,
  },

  previewTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#151126',
  },

  previewSub: {
    margin: '6px 0 12px',
    color: '#64748b',
    fontSize: 13,
  },

  previewTags: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 14,
  },

  previewTag: {
    padding: '6px 9px',
    borderRadius: 999,
    background: '#ecfdf3',
    color: '#2f7d25',
    fontSize: 11,
    fontWeight: 700,
  },

  previewDesc: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 1.5,
    margin: 0,
  },

  previewDivider: {
    height: 1,
    background: '#f1edf8',
    margin: '18px 0',
  },

  previewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    textAlign: 'left',
    fontSize: 12,
    color: '#64748b',
    padding: '8px 0',
  },

  visibleNote: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    background: '#f0f9ec',
  },

  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
  },

  infoBox: {
    border: '1px solid #eee9f7',
    borderRadius: 14,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    fontSize: 13,
    color: '#64748b',
  },

  submitNote: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    background: '#f3e8ff',
    color: '#7c3aed',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 700,
  },

  actions: {
    borderTop: '1px solid #eee9f7',
    paddingTop: 18,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
  },

  secondaryButton: {
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#334155',
    borderRadius: 12,
    padding: '12px 18px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  primaryButton: {
    border: 'none',
    background: 'linear-gradient(135deg, #4f9d35, #2f7d25)',
    color: '#ffffff',
    borderRadius: 12,
    padding: '12px 22px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 10px 22px rgba(47,125,37,0.18)',
  },

  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};