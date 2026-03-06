'use client';
import { useState } from 'react';
import MapPlaceholder from '@/components/MapPlaceholder';
import StatusBadge from '@/components/StatusBadge';

type DriverState = 'idle' | 'incoming' | 'navigating';

const incomingRequest = {
    patientRef: 'PAT-0041',
    emergencyType: 'Cardiac Arrest',
    emergencyIcon: '🫀',
    urgencyColor: '#ff3b3b',
    location: 'Connaught Place, Block D, New Delhi',
    distanceKm: '0.8 km away',
    eta: 4,
    hospital: 'Apollo Hospitals',
};

export default function DriverPage() {
    const [driverState, setDriverState] = useState<DriverState>('idle');
    const [accepted, setAccepted] = useState(false);
    const [declined, setDeclined] = useState(false);

    const handleAccept = () => {
        setAccepted(true);
        setTimeout(() => setDriverState('navigating'), 600);
    };

    const handleDecline = () => {
        setDeclined(true);
        setTimeout(() => { setDeclined(false); setDriverState('idle'); }, 2000);
    };

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
                    <div style={{ fontSize: '32px' }}>👨‍✈️</div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px' }}>
                            Rajan Kumar — Driver App
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>
                            DL 01 AB 2234 · Advanced Life Support · Rating ⭐ 4.9
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <StatusBadge status={driverState === 'navigating' ? 'confirmed' : 'idle'} size="md" />
                    {driverState === 'idle' && (
                        <button
                            onClick={() => setDriverState('incoming')}
                            className="sp-btn-brand"
                            style={{ fontSize: '12px' }}
                        >
                            Simulate Incoming Request
                        </button>
                    )}
                </div>
            </div>

            {/* Main */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

                {/* Map (always visible underneath) */}
                <div style={{ padding: '16px', height: '100%' }}>
                    <MapPlaceholder
                        showRoute={driverState === 'navigating'}
                        showAmbulance={false}
                        label={driverState === 'navigating' ? '→ Connaught Place, Block D' : 'New Delhi — Standby'}
                    />
                </div>

                {/* IDLE state */}
                {driverState === 'idle' && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(8,8,16,0.92)',
                        border: '1px solid var(--sp-border)',
                        borderRadius: '16px',
                        padding: '32px',
                        textAlign: 'center',
                        backdropFilter: 'blur(20px)',
                        width: '280px',
                        animation: 'fade-in 0.3s ease-out',
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>😴</div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
                            Waiting for requests
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--sp-text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                            You are online and available. Requests will appear instantly when nearby emergencies are dispatched.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <span className="sp-dot-live" />
                            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 500 }}>Online</span>
                        </div>
                    </div>
                )}

                {/* INCOMING REQUEST — Full screen overlay */}
                {driverState === 'incoming' && !accepted && !declined && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.88)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fade-in 0.2s ease-out',
                        zIndex: 10,
                    }}>
                        <div style={{
                            background: 'var(--sp-surface)',
                            border: '2px solid #ff3b3b',
                            borderRadius: '20px',
                            padding: '32px',
                            width: '380px',
                            boxShadow: '0 0 60px rgba(255,59,59,0.3)',
                            animation: 'slide-up 0.35s ease-out',
                        }}>
                            {/* Alert header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <div style={{
                                    background: 'rgba(255,59,59,0.15)',
                                    borderRadius: '12px',
                                    padding: '10px',
                                    fontSize: '28px',
                                    animation: 'pulse-danger 1.5s ease infinite',
                                }}>
                                    🚨
                                </div>
                                <div>
                                    <div style={{ color: '#ff3b3b', fontWeight: 800, fontSize: '18px', fontFamily: 'var(--font-heading)' }}>
                                        INCOMING REQUEST
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>Accept within 30 seconds</div>
                                </div>
                            </div>

                            {/* Emergency type */}
                            <div style={{
                                background: `rgba(255,59,59,0.08)`,
                                border: `1px solid rgba(255,59,59,0.2)`,
                                borderRadius: '12px',
                                padding: '14px',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}>
                                <span style={{ fontSize: '32px' }}>{incomingRequest.emergencyIcon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '16px', color: incomingRequest.urgencyColor }}>
                                        {incomingRequest.emergencyType}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--sp-text-muted)' }}>{incomingRequest.patientRef}</div>
                                </div>
                            </div>

                            {/* Details */}
                            {[
                                ['📍 Location', incomingRequest.location],
                                ['📏 Distance', incomingRequest.distanceKm],
                                ['⚡ ETA to patient', `${incomingRequest.eta} minutes`],
                                ['🏥 Assigned hospital', incomingRequest.hospital],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--sp-text-muted)' }}>{k}</span>
                                    <span style={{ color: 'var(--sp-text)', fontWeight: 500 }}>{v}</span>
                                </div>
                            ))}

                            {/* Action buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                                <button
                                    onClick={handleDecline}
                                    className="sp-btn-ghost"
                                    style={{ padding: '16px', fontSize: '15px' }}
                                >
                                    ✕ Decline
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="sp-btn-brand"
                                    style={{
                                        padding: '16px', fontSize: '15px', fontWeight: 800,
                                        background: 'linear-gradient(135deg, #00d4aa, #00b894)',
                                        borderRadius: '10px',
                                    }}
                                >
                                    ✓ Accept
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Declined message */}
                {declined && (
                    <div style={{
                        position: 'absolute', top: '20px', right: '20px',
                        background: 'var(--sp-surface-2)',
                        border: '1px solid var(--sp-border)',
                        borderRadius: '10px',
                        padding: '12px 20px',
                        fontSize: '13px',
                        color: 'var(--sp-text-muted)',
                        animation: 'slide-up 0.3s ease-out',
                        zIndex: 20,
                    }}>
                        Request declined. Returning to standby…
                    </div>
                )}

                {/* NAVIGATING mode */}
                {driverState === 'navigating' && (
                    <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(8,8,16,0.95)',
                        border: '1px solid var(--sp-brand)',
                        borderRadius: '16px',
                        padding: '16px 28px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        backdropFilter: 'blur(20px)',
                        animation: 'slide-up 0.4s ease-out',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 40px rgba(0,212,170,0.15)',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: 'var(--sp-text-muted)', marginBottom: '2px' }}>NEXT TURN</div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--sp-text)' }}>← Ring Road</div>
                        </div>
                        <div style={{ width: '1px', height: '36px', background: 'var(--sp-border)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: 'var(--sp-text-muted)', marginBottom: '2px' }}>ETA to Patient</div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--sp-brand)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>4 min</div>
                        </div>
                        <div style={{ width: '1px', height: '36px', background: 'var(--sp-border)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: 'var(--sp-text-muted)', marginBottom: '2px' }}>Distance</div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--sp-text)' }}>0.8 km</div>
                        </div>
                        <div style={{ width: '1px', height: '36px', background: 'var(--sp-border)' }} />
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--sp-text)' }}>Cardiac Arrest</div>
                            <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>Connaught Place, Block D</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
