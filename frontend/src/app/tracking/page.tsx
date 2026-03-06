'use client';
import { useState, useEffect } from 'react';
import MapPlaceholder from '@/components/MapPlaceholder';
import StatusBadge from '@/components/StatusBadge';
import { RequestStatus } from '@/lib/mockData';

const statusFlow: RequestStatus[] = ['pending', 'dispatching', 'confirmed', 'arriving'];

const statusDetails: Record<string, { title: string; desc: string; icon: string }> = {
    pending: { title: 'Request Submitted', desc: 'Searching for available ambulances and hospitals…', icon: '📡' },
    dispatching: { title: 'Dispatching', desc: 'Parallel blast sent to 5 nearest ambulances…', icon: '⚡' },
    confirmed: { title: 'Ambulance Confirmed', desc: 'Rajan Kumar (ALS) is on the way to you!', icon: '✅' },
    arriving: { title: 'Ambulance Arriving', desc: 'Turn left on Ring Road — ETA less than 2 minutes', icon: '🚑' },
};

export default function TrackingPage() {
    const [statusIndex, setStatusIndex] = useState(0);
    const [eta, setEta] = useState(4);

    const status = statusFlow[statusIndex];

    // Simulate status progression
    useEffect(() => {
        if (statusIndex >= statusFlow.length - 1) return;
        const delays = [1500, 2500, 3000];
        const t = setTimeout(() => setStatusIndex(i => i + 1), delays[statusIndex] ?? 2000);
        return () => clearTimeout(t);
    }, [statusIndex]);

    // Countdown ETA after confirmed
    useEffect(() => {
        if (status !== 'confirmed' && status !== 'arriving') return;
        if (eta <= 0) return;
        const t = setInterval(() => setEta(e => Math.max(0, e - 1)), 1000);
        return () => clearInterval(t);
    }, [status, eta]);

    return (
        <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{
                padding: '14px 24px',
                borderBottom: '1px solid var(--sp-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--sp-surface)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <StatusBadge status={status} size="lg" />
                    <div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px' }}>
                            Live Tracking — REQ-0041
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>
                            Cardiac Emergency · Connaught Place, New Delhi
                        </div>
                    </div>
                </div>
                {(status === 'confirmed' || status === 'arriving') && (
                    <div style={{
                        background: 'var(--sp-surface-2)',
                        border: '1px solid var(--sp-border)',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <span style={{ fontSize: '24px', animation: 'ambulance-move 1.5s ease-in-out infinite' }}>🚑</span>
                        <div>
                            <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>ETA</div>
                            <div style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: eta <= 2 ? '#ff3b3b' : 'var(--sp-brand)', lineHeight: 1 }}>
                                {eta} min
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main layout */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '340px 1fr', overflow: 'hidden' }}>

                {/* LEFT — Status timeline */}
                <div style={{ borderRight: '1px solid var(--sp-border)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Status card */}
                    <div style={{
                        background: 'var(--sp-surface-2)',
                        border: '1px solid var(--sp-border)',
                        borderRadius: '14px',
                        padding: '20px',
                        textAlign: 'center',
                        animation: 'fade-in 0.3s ease-out',
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>{statusDetails[status].icon}</div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, marginBottom: '6px', color: 'var(--sp-text)' }}>
                            {statusDetails[status].title}
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--sp-text-muted)', lineHeight: '1.5' }}>
                            {statusDetails[status].desc}
                        </p>
                    </div>

                    {/* Progress timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <p style={{ fontSize: '11px', color: 'var(--sp-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '8px' }}>
                            Status Timeline
                        </p>
                        {statusFlow.map((s, i) => {
                            const done = i < statusIndex;
                            const active = i === statusIndex;
                            return (
                                <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    {/* Dot + line */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2px' }}>
                                        <div style={{
                                            width: '12px', height: '12px',
                                            borderRadius: '50%',
                                            background: done ? 'var(--sp-brand)' : active ? '#ff3b3b' : 'var(--sp-surface-3)',
                                            border: `2px solid ${done ? 'var(--sp-brand)' : active ? '#ff3b3b' : 'var(--sp-border)'}`,
                                            animation: active ? 'dot-pulse 1s ease-in-out infinite' : 'none',
                                            flexShrink: 0,
                                        }} />
                                        {i < statusFlow.length - 1 && (
                                            <div style={{
                                                width: '2px', height: '32px',
                                                background: done ? 'var(--sp-brand)' : 'var(--sp-surface-3)',
                                                marginTop: '4px',
                                                transition: 'background 0.5s',
                                            }} />
                                        )}
                                    </div>
                                    <div style={{ paddingBottom: '16px' }}>
                                        <div style={{
                                            fontSize: '13px', fontWeight: active || done ? 600 : 400,
                                            color: active ? '#ff3b3b' : done ? 'var(--sp-brand)' : 'var(--sp-text-dim)',
                                            textTransform: 'capitalize',
                                        }}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </div>
                                        {active && (
                                            <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)', marginTop: '2px' }}>
                                                In progress…
                                            </div>
                                        )}
                                        {done && (
                                            <div style={{ fontSize: '11px', color: 'var(--sp-brand)', marginTop: '2px' }}>✓ Done</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Driver info — shows after confirmed */}
                    {(status === 'confirmed' || status === 'arriving') && (
                        <div style={{
                            background: 'rgba(0,212,170,0.06)',
                            border: '1px solid rgba(0,212,170,0.2)',
                            borderRadius: '14px',
                            padding: '16px',
                            animation: 'slide-up 0.4s ease-out',
                        }}>
                            <p style={{ fontSize: '11px', color: 'var(--sp-brand)', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Confirmed Ambulance
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ fontSize: '28px' }}>👨‍✈️</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--sp-text)' }}>Rajan Kumar</div>
                                    <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>Advanced Life Support</div>
                                </div>
                            </div>
                            {[
                                ['Vehicle', 'DL 01 AB 2234 (ALS)'],
                                ['Phone', '+91 98765 43210'],
                                ['Hospital', 'Apollo Hospitals'],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                    <span style={{ color: 'var(--sp-text-muted)' }}>{k}</span>
                                    <span style={{ color: 'var(--sp-text)', fontWeight: 500 }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Payment note */}
                    {status === 'arriving' && (
                        <div style={{
                            background: 'rgba(168,85,247,0.06)',
                            border: '1px solid rgba(168,85,247,0.2)',
                            borderRadius: '10px',
                            padding: '12px',
                            fontSize: '12px',
                            color: '#a855f7',
                            animation: 'fade-in 0.4s ease-out',
                        }}>
                            💳 <strong>Deferred Payment:</strong> Your card will be authorized, but charged only after the emergency. 48-hour grace period applies.
                        </div>
                    )}
                </div>

                {/* RIGHT — Map */}
                <div style={{ padding: '16px' }}>
                    <MapPlaceholder
                        showRoute
                        showAmbulance={status === 'confirmed' || status === 'arriving'}
                        ambulanceEta={status === 'confirmed' || status === 'arriving' ? eta : undefined}
                        label="Live tracking — New Delhi"
                    />
                </div>
            </div>
        </div>
    );
}
