export const Logo = () => {
  return (
    <div style={styles.logoWrap}>
      <img
        src="https://ckklrguidafoseanzmdk.supabase.co/storage/v1/object/public/assets/logo/logo.png"
        alt="Droooly"
        style={styles.logo}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  logoWrap: {
    padding: '0 6px',
  },

  logo: {
    width: 162,
    height: 'auto',
    objectFit: 'contain',
  },
};
