'use client';
import { useState } from 'react';
import { hospitals, ambulances, filterHospitalsByType, EmergencyType } from '@/lib/mockData';
import HospitalCard from '@/components/HospitalCard';
import AmbulanceCard from '@/components/AmbulanceCard';
import MapPlaceholder from '@/components/MapPlaceholder';
import SosButton from '@/components/SosButton';

export default function LandingPage() {
  const [mode, setMode] = useState<'hospital' | 'ambulance'>('hospital');
  const [sosFired, setSosFired] = useState(false);

  const filteredHospitals = hospitals;
  const filteredAmbulances = ambulances.filter(a => a.isAvailable);

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Hero SOS strip */}
      {!sosFired ? (
        <div style={{
          background: 'linear-gradient(90deg, rgba(255,59,59,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,59,59,0.12)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px', fontWeight: 800,
              color: 'var(--sp-text)', marginBottom: '2px',
            }}>
              Emergency Response — <span style={{ color: 'var(--sp-brand)' }}>Real-Time Dispatch</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--sp-text-muted)' }}>
              📍 Detecting location… New Delhi, India &nbsp;·&nbsp; 5 hospitals nearby &nbsp;·&nbsp; 3 ambulances available
            </p>
          </div>
          <SosButton onClick={() => setSosFired(true)} />
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,59,59,0.08)',
          borderBottom: '1px solid rgba(255,59,59,0.25)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slide-up 0.3s ease-out',
        }}>
          <span style={{ fontSize: '24px' }}>🆘</span>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', color: '#ff3b3b' }}>
              SOS Activated — Dispatching to nearest units
            </div>
            <div style={{ fontSize: '12px', color: 'var(--sp-text-muted)' }}>
              Parallel blast sent to 5 nearest ambulances · Hospitals alerted
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="sp-dot-live-danger" />
            <span style={{ fontSize: '12px', color: '#ff3b3b', fontWeight: 600 }}>DISPATCHING</span>
          </div>
        </div>
      )}

      {/* Main split layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr', overflow: 'hidden' }}>

        {/* LEFT PANEL */}
        <div style={{ borderRight: '1px solid var(--sp-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Search bar */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--sp-border)' }}>
            <input
              className="sp-input"
              defaultValue="New Delhi, India — Auto-detected"
              style={{ marginBottom: '10px' }}
              readOnly
            />
            {/* Toggle */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              background: 'var(--sp-surface-3)',
              borderRadius: '10px', padding: '3px',
            }}>
              {(['hospital', 'ambulance'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: mode === m ? 'var(--sp-brand)' : 'transparent',
                  color: mode === m ? '#000' : 'var(--sp-text-muted)',
                  fontWeight: mode === m ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                }}>
                  {m === 'hospital' ? '🏥 Hospitals' : '🚑 Ambulances'}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--sp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--sp-text-muted)' }}>
              {mode === 'hospital' ? `${filteredHospitals.length} hospitals found` : `${filteredAmbulances.length} ambulances available`}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--sp-text-dim)' }}>Sorted by distance</span>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mode === 'hospital'
              ? filteredHospitals.map(h => <HospitalCard key={h.id} hospital={h} />)
              : filteredAmbulances.map(a => <AmbulanceCard key={a.id} ambulance={a} showActions />)
            }
          </div>
        </div>

        {/* RIGHT PANEL — Map */}
        <div style={{ padding: '16px', overflow: 'hidden' }}>
          <MapPlaceholder
            showRoute={sosFired}
            showAmbulance={sosFired}
            ambulanceEta={sosFired ? 4 : undefined}
            label="New Delhi, India"
          />
        </div>
      </div>
    </div>
  );
}
