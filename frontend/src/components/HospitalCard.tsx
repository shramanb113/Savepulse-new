'use client';
import { Hospital } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

interface Props {
    hospital: Hospital;
    selected?: boolean;
    onSelect?: (id: string) => void;
    showDispatchButton?: boolean;
}

const traumaLabel: Record<number, string> = { 1: 'Level I Trauma', 2: 'Level II Trauma', 3: 'Level III Trauma' };
const traumaColor: Record<number, string> = { 1: '#ff3b3b', 2: '#f59e0b', 3: '#3b82f6' };

export default function HospitalCard({ hospital: h, selected, onSelect, showDispatchButton = true }: Props) {
    const router = useRouter();

    const availColor =
        h.availability === 'available' ? '#10b981' :
            h.availability === 'limited' ? '#f59e0b' : '#ef4444';

    const availLabel =
        h.availability === 'available' ? 'Available' :
            h.availability === 'limited' ? 'Limited' : 'Full';

    return (
        <div
            onClick={() => onSelect?.(h.id)}
            style={{
                background: selected ? 'rgba(0,212,170,0.06)' : 'var(--sp-surface-2)',
                border: `1px solid ${selected ? 'var(--sp-brand)' : 'var(--sp-border)'}`,
                borderRadius: '14px',
                padding: '16px',
                cursor: onSelect ? 'pointer' : 'default',
                transition: 'all 0.2s',
                boxShadow: selected ? '0 0 20px rgba(0,212,170,0.1)' : 'none',
                animation: 'fade-in 0.35s ease-out',
            }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '16px' }}>🏥</span>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '15px', color: 'var(--sp-text)' }}>
                            {h.name}
                        </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--sp-text-muted)', lineHeight: '1.4' }}>{h.address}</p>
                </div>
                {/* Availability dot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: availColor }} />
                    <span style={{ fontSize: '11px', color: availColor, fontWeight: 500 }}>{availLabel}</span>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                <StatPill icon="⏱" label="ER Wait" value={`${h.erWaitMin} min`} alert={h.erWaitMin > 15} />
                <StatPill icon="📍" label="Distance" value={h.distance} />
                <StatPill icon="🛏" label="Beds" value={`${h.bedsAvailable}`} alert={h.bedsAvailable === 0} />
                <StatPill icon="🧊" label="ICU" value={h.icuAvailable ? 'Yes' : 'No'} alert={!h.icuAvailable} />
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                <span style={{
                    padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                    background: `${traumaColor[h.traumaLevel]}18`, color: traumaColor[h.traumaLevel], border: `1px solid ${traumaColor[h.traumaLevel]}30`,
                }}>
                    {traumaLabel[h.traumaLevel]}
                </span>
                {h.hasCardiacUnit && <SpecBadge label="Cardiac" />}
                {h.hasTraumaUnit && <SpecBadge label="Trauma" />}
                {h.hasRespUnit && <SpecBadge label="Respiratory" />}
                {h.hasMaternalUnit && <SpecBadge label="Maternal" />}
            </div>

            {/* Actions */}
            {showDispatchButton && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push('/tracking'); }}
                        className="sp-btn-brand"
                        disabled={h.availability === 'full'}
                        style={{ flex: 1, opacity: h.availability === 'full' ? 0.5 : 1 }}
                    >
                        {h.availability === 'full' ? 'Full — Unavailable' : 'Dispatch Here'}
                    </button>
                    <button className="sp-btn-ghost" style={{ padding: '10px 14px' }}>Details</button>
                </div>
            )}
        </div>
    );
}

function StatPill({ icon, label, value, alert }: { icon: string; label: string; value: string; alert?: boolean }) {
    return (
        <div style={{
            background: 'var(--sp-surface-3)',
            borderRadius: '8px',
            padding: '8px 10px',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '14px', marginBottom: '2px' }}>{icon}</div>
            <div style={{ fontSize: '11px', color: 'var(--sp-text-dim)', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: alert ? '#ef4444' : 'var(--sp-text)' }}>{value}</div>
        </div>
    );
}

function SpecBadge({ label }: { label: string }) {
    return (
        <span style={{
            padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 500,
            background: 'rgba(0,212,170,0.08)', color: 'var(--sp-brand)', border: '1px solid rgba(0,212,170,0.15)',
        }}>
            {label}
        </span>
    );
}
