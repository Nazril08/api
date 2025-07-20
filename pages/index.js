import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Head>
        <title>Yeyo Rest API</title>
      </Head>
      <h1>Welcome to Yeyo Rest API</h1>
      <p>
        For API documentation, please visit{' '}
        <Link href="/docs" style={{ color: 'blue' }}>
          /docs
        </Link>
        .
      </p>
    </div>
  );
} 