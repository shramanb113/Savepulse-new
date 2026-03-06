'use client';
import { Ambulance, vehicleTypeLabel } from '@/lib/mockData';

interface Props {
    ambulance: Ambulance;
    onAccept?: (id: string) => void;
    onDecline?: (id: string) => void;
    showActions?: boolean;
}

const vehicleColor: Record<string, string> = {
    ALS: '#00d4aa',
    MICU: '#a855f7',
    BLS: '#3b82f6',
};

export default function AmbulanceCard({ ambulance: a, onAccept, onDecline, showActions = false }: Props) {
    return (
        <div
            style={{
                background: 'var(--sp-surface-2)',
                border: `1px solid ${a.isAvailable ? 'var(--sp-border)' : 'rgba(255,255,255,0.03)'}`,
                borderRadius: '14px',
                padding: '16px',
                opacity: a.isAvailable ? 1 : 0.5,
                transition: 'all 0.2s',
                animation: 'fade-in 0.35s ease-out',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                        style={{
                            width: '40px', height: '40px',
                            borderRadius: '50%',
                            background: `${vehicleColor[a.vehicleType]}15`,
                            border: `1px solid ${vehicleColor[a.vehicleType]}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px',
                        }}
                    >
                        🚑
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--sp-text)', marginBottom: '2px' }}>
                            {a.driverName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--sp-text-dim)' }}>{a.vehicleNumber}</div>
                    </div>
                </div>
                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: a.isAvailable ? '#10b981' : '#ef4444',
                        animation: a.isAvailable ? 'dot-pulse 1.5s ease-in-out infinite' : 'none',
                    }} />
                    <span style={{ fontSize: '11px', color: a.isAvailable ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                        {a.isAvailable ? 'Available' : 'On Call'}
                    </span>
                </div>
            </div>

            {/* Vehicle type badge */}
            <div style={{ marginBottom: '12px' }}>
                <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                    background: `${vehicleColor[a.vehicleType]}12`,
                    color: vehicleColor[a.vehicleType],
                    border: `1px solid ${vehicleColor[a.vehicleType]}25`,
                }}>
                    {a.vehicleType} — {vehicleTypeLabel[a.vehicleType]}
                </span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: showActions ? '12px' : '0' }}>
                <MiniStat icon="⚡" label="ETA" value={`${a.etaMin} min`} highlight />
                <MiniStat icon="📍" label="Distance" value={a.distance} />
                <MiniStat icon="⭐" label="Rating" value={`${a.rating}`} />
            </div>

            {/* Actions */}
            {showActions && a.isAvailable && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => onAccept?.(a.id)}
                        className="sp-btn-brand"
                        style={{ flex: 1 }}
                    >
                        Dispatch
                    </button>
                    <button
                        onClick={() => onDecline?.(a.id)}
                        className="sp-btn-ghost"
                        style={{ padding: '10px 14px' }}
                    >
                        Skip
                    </button>
                </div>
            )}
        </div>
    );
}

function MiniStat({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
    return (
        <div style={{ background: 'var(--sp-surface-3)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', marginBottom: '2px' }}>{icon}</div>
            <div style={{ fontSize: '10px', color: 'var(--sp-text-dim)', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: highlight ? 'var(--sp-brand)' : 'var(--sp-text)' }}>{value}</div>
        </div>
    );
}
