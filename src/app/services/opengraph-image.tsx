import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const alt = 'RINK Services Portal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

let logoDataUri: string | null = null;

function getLogo() {
  if (!logoDataUri) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'images', 'rink_logo.png');
      const buffer = fs.readFileSync(filePath);
      logoDataUri = `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (e) {
      console.error('Failed to load rink logo', e);
      logoDataUri = ''; 
    }
  }
  return logoDataUri;
}

export default async function Image() {
  const logo = getLogo();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#05112B',
          backgroundImage: 'radial-gradient(circle at 50% 0%, #1a365d 0%, #05112B 80%)',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '48px',
        }}
      >
        {/* Tech grid overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.06)"/></svg>')`,
          }}
        />

        {/* Content Container (Glassmorphism Card) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '32px',
            padding: '56px 64px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                padding: '16px 28px',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              }}>
                {logo ? (
                  <img src={logo} width={200} style={{ objectFit: 'contain' }} alt="RINK Logo" />
                ) : (
                  <span style={{ fontSize: 40, fontWeight: 800, color: '#05112B' }}>RINK</span>
                )}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Research Innovation Network Kerala (RINK)
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', marginBottom: 'auto' }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: '#F4B400', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
              Specialised Services
            </p>
            <h1 style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.15, margin: 0, display: 'flex', flexDirection: 'column', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#ffffff' }}>Discover R&D Services from</span>
              <span style={{ color: '#94A3B8' }}>Kerala&apos;s Leading Startups.</span>
            </h1>
          </div>

          {/* Badges / Footer */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {[
              { label: 'Startups' },
              { label: 'Universities' },
              { label: 'R&D Labs' }
            ].map((badge, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 32px', backgroundColor: 'rgba(244,180,0,0.15)', border: '1px solid rgba(244,180,0,0.3)', borderRadius: '100px' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="6" fill="#F4B400" />
                </svg>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.02em' }}>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
