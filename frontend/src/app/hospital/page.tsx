'use client';
import { useState } from 'react';
import { incomingRequests, IncomingRequest, emergencyTypes } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';

const urgencyColor: Record<string, string> = {
    critical: '#ff3b3b',
    high: '#f59e0b',
    medium: '#3b82f6',
};

export default function HospitalPage() {
    const [requests, setRequests] = useState<IncomingRequest[]>(incomingRequests);
    const [beds, setBeds] = useState(12);
    const [icu, setIcu] = useState(true);

    const handleAccept = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
    };

    const handleDecline = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'declined' } : r));
    };

    const activeRequests = requests.filter(r => r.status === 'incoming');
    const acceptedRequests = requests.filter(r => r.status === 'accepted');

    return (
        <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{
                padding: '14px 24px',
                borderBottom: '1px solid var(--sp-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--sp-surface)',
                gap: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>🏥</span>
                    <div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px' }}>
                            Apollo Hospitals — ER Dashboard
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>
                            Dr. Meena Iyer · ER Chief · Level I Trauma Centre
                        </div>
                    </div>
                </div>

                {/* Availability controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Beds counter */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'var(--sp-surface-2)',
                        border: '1px solid var(--sp-border)',
                        borderRadius: '10px',
                        padding: '8px 14px',
                    }}>
                        <span style={{ fontSize: '13px', color: 'var(--sp-text-muted)' }}>🛏 Beds</span>
                        <button onClick={() => setBeds(b => Math.max(0, b - 1))} style={{ background: 'var(--sp-surface-3)', border: 'none', color: 'var(--sp-text)', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>−</button>
                        <span style={{ fontWeight: 700, fontSize: '16px', color: beds === 0 ? '#ef4444' : 'var(--sp-brand)', minWidth: '24px', textAlign: 'center' }}>{beds}</span>
                        <button onClick={() => setBeds(b => b + 1)} style={{ background: 'var(--sp-surface-3)', border: 'none', color: 'var(--sp-text)', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>+</button>
                    </div>
                    {/* ICU toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--sp-text-muted)' }}>🧊 ICU</span>
                        <button
                            onClick={() => setIcu(v => !v)}
                            style={{
                                width: '44px', height: '24px',
                                borderRadius: '12px',
                                background: icu ? 'var(--sp-brand)' : 'var(--sp-surface-3)',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'background 0.2s',
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '3px',
                                left: icu ? '22px' : '3px',
                                width: '18px', height: '18px',
                                borderRadius: '50%',
                                background: '#fff',
                                transition: 'left 0.2s',
                            }} />
                        </button>
                        <span style={{ fontSize: '12px', color: icu ? 'var(--sp-brand)' : '#ef4444', fontWeight: 600 }}>
                            {icu ? 'Available' : 'Full'}
                        </span>
                    </div>
                    <StatusBadge status={activeRequests.length > 0 ? 'dispatching' : 'idle'} size="md" />
                </div>
            </div>

            {/* Main layout */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', gap: '0' }}>

                {/* LEFT — Incoming requests */}
                <div style={{ borderRight: '1px solid var(--sp-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--sp-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--sp-text)' }}>
                            Incoming Requests
                        </span>
                        {activeRequests.length > 0 && (
                            <span style={{
                                background: '#ff3b3b', borderRadius: '100px',
                                padding: '1px 8px', fontSize: '11px', fontWeight: 700, color: '#fff',
                            }}>
                                {activeRequests.length} new
                            </span>
                        )}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {requests.map(req => {
                            const etDef = emergencyTypes.find(e => e.id === req.emergencyType);
                            const isPending = req.status === 'incoming';
                            const isAccepted = req.status === 'accepted';
                            const isDeclined = req.status === 'declined';
                            return (
                                <div
                                    key={req.id}
                                    style={{
                                        background: isPending ? 'rgba(255,59,59,0.04)' : isAccepted ? 'rgba(0,212,170,0.04)' : 'var(--sp-surface-2)',
                                        border: `1px solid ${isPending ? 'rgba(255,59,59,0.2)' : isAccepted ? 'rgba(0,212,170,0.2)' : 'var(--sp-border)'}`,
                                        borderRadius: '14px',
                                        padding: '16px',
                                        opacity: isDeclined ? 0.4 : 1,
                                        transition: 'all 0.3s',
                                        animation: 'fade-in 0.35s ease-out',
                                    }}
                                >
                                    {/* Top row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                background: `${urgencyColor[req.urgency]}12`,
                                                border: `1px solid ${urgencyColor[req.urgency]}25`,
                                                borderRadius: '10px',
                                                padding: '8px',
                                                fontSize: '20px',
                                                animation: isPending ? 'pulse-danger 1.8s ease infinite' : 'none',
                                            }}>
                                                {etDef?.icon ?? '🚨'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--sp-text)' }}>
                                                    {etDef?.label ?? req.emergencyType}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>{req.patientRef}</div>
                                            </div>
                                        </div>
                                        <div style={{
                                            background: `${urgencyColor[req.urgency]}15`,
                                            color: urgencyColor[req.urgency],
                                            borderRadius: '6px',
                                            padding: '3px 8px',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                        }}>
                                            {req.urgency}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                                        {[
                                            ['📍', req.location],
                                            ['🚑', `${req.ambulanceDriver} — ETA ${req.etaMin} min`],
                                            ['⏰', `Received at ${req.receivedAt}`],
                                            ['🏁', `Expected arrival ${req.arrivalTime}`],
                                        ].map(([icon, text]) => (
                                            <div key={text} style={{ fontSize: '12px', color: 'var(--sp-text-muted)', display: 'flex', gap: '6px' }}>
                                                <span>{icon}</span><span>{text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    {isPending && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            <button
                                                onClick={() => handleDecline(req.id)}
                                                className="sp-btn-ghost"
                                                style={{ fontSize: '13px', padding: '10px' }}
                                            >
                                                ✕ Decline
                                            </button>
                                            <button
                                                onClick={() => handleAccept(req.id)}
                                                className="sp-btn-brand"
                                                style={{ fontSize: '13px', padding: '10px' }}
                                            >
                                                ✓ Accept Patient
                                            </button>
                                        </div>
                                    )}
                                    {isAccepted && (
                                        <div style={{ textAlign: 'center', color: 'var(--sp-brand)', fontWeight: 600, fontSize: '13px' }}>
                                            ✅ Patient Accepted — Prep ER Bay
                                        </div>
                                    )}
                                    {isDeclined && (
                                        <div style={{ textAlign: 'center', color: 'var(--sp-text-dim)', fontSize: '13px' }}>
                                            Declined
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT — Active emergencies + stats */}
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--sp-border)' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--sp-text)' }}>
                            Active Emergencies ({acceptedRequests.length})
                        </span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                        {/* Stats grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '4px' }}>
                            {[
                                { icon: '🛏', label: 'Beds Available', value: beds.toString(), color: beds === 0 ? '#ef4444' : 'var(--sp-brand)' },
                                { icon: '🧊', label: 'ICU Status', value: icu ? 'Available' : 'Full', color: icu ? '#10b981' : '#ef4444' },
                                { icon: '🚨', label: 'Incoming', value: activeRequests.length.toString(), color: activeRequests.length > 0 ? '#ff3b3b' : 'var(--sp-text-muted)' },
                                { icon: '✅', label: 'Accepted', value: acceptedRequests.length.toString(), color: '#10b981' },
                            ].map(s => (
                                <div key={s.label} style={{
                                    background: 'var(--sp-surface-2)',
                                    border: '1px solid var(--sp-border)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '22px', marginBottom: '4px' }}>{s.icon}</div>
                                    <div style={{ fontSize: '22px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)', marginTop: '2px' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Accepted list */}
                        {acceptedRequests.length === 0 ? (
                            <div style={{
                                flex: 1,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--sp-text-dim)', fontSize: '13px', gap: '8px', padding: '40px 0',
                            }}>
                                <span style={{ fontSize: '32px' }}>🩺</span>
                                No active patients en route
                            </div>
                        ) : (
                            acceptedRequests.map(req => {
                                const etDef = emergencyTypes.find(e => e.id === req.emergencyType);
                                return (
                                    <div key={req.id} style={{
                                        background: 'rgba(0,212,170,0.04)',
                                        border: '1px solid rgba(0,212,170,0.15)',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        animation: 'slide-up 0.3s ease-out',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '20px' }}>{etDef?.icon}</span>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--sp-text)' }}>{etDef?.label}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>{req.patientRef} · ETA {req.etaMin} min</div>
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <StatusBadge status="arriving" size="sm" />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--sp-text-muted)' }}>
                                            🚑 {req.ambulanceDriver} &nbsp;·&nbsp; Arrival at {req.arrivalTime}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
