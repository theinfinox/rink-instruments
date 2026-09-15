import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RINK Instruments Portal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#05112B', // RINK dark blue theme
          backgroundImage: 'radial-gradient(circle at 50% -20%, #1a365d 0%, #05112B 60%)',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#60A5FA',
            marginBottom: '40px',
          }}
        >
          Research Innovation Network Kerala . Instrumentation Portal
        </p>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '40px',
            maxWidth: '95%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ marginBottom: '10px' }}>Discover Scientific Instruments from</span>
          <span>Kerala's Leading Research</span>
          <span>Institutions & Startups.</span>
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px',
            background: '#3B82F6', // Blue button look
            padding: '20px 48px',
            borderRadius: '100px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 700, color: '#ffffff' }}>Search Instruments</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
