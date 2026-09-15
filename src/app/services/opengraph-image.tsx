import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RINK Services Portal';
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
            color: '#F4B400', // Yellow brand for Services
            marginBottom: '40px',
          }}
        >
          Research Innovation Network Kerala . Services Portal
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
          <span style={{ marginBottom: '10px' }}>Discover Specialised R&D</span>
          <span>Services from Kerala's Leading</span>
          <span>Startups & Institutions.</span>
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px',
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px 48px',
            borderRadius: '100px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 700, color: '#ffffff' }}>Search Services</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
