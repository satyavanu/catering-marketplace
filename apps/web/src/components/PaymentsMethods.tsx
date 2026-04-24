import Image from 'next/image';

const PaymentMethods = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Image
      src="/images/payment-methods/visa.svg"
      alt="Visa"
      width={40}
      height={24}
      priority={false}
    />
    <Image
      src="/images/payment-methods/mastercard.svg"
      alt="Mastercard"
      width={40}
      height={24}
      priority={false}
    />
    <Image
      src="/images/payment-methods/google-pay.svg"
      alt="Google Pay"
      width={40}
      height={24}
      priority={false}
    />
  </div>
);

const SocialLinks = () => (
  <div style={{ display: 'flex', gap: '12px' }}>
    {[
      { icon: 'facebook', url: '#' },
      { icon: 'instagram', url: '#' },
      { icon: 'linkedin', url: '#' },
      { icon: 'twitter', url: '#' },
    ].map((social) => (
      <a
        key={social.icon}
        href={social.url}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Image
          src={`/images/social/${social.icon}.svg`}
          alt={social.icon}
          width={20}
          height={20}
        />
      </a>
    ))}
  </div>
);