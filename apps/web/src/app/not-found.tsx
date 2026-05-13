
import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <p>Page not found</p>
        <Link href="/">Go home</Link>
      </div>
    </main>
  );
}