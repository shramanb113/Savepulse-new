'use client';
import { useState } from 'react';
import { filterHospitalsByType, ambulances, EmergencyType } from '@/lib/mockData';
import HospitalCard from '@/components/HospitalCard';
import AmbulanceCard from '@/components/AmbulanceCard';
import EmergencyTypeSelector from '@/components/EmergencyTypeSelector';
import MapPlaceholder from '@/components/MapPlaceholder';
import StatusBadge from '@/components/StatusBadge';
import { useRouter } from 'next/navigation';

type Tab = 'hospitals' | 'ambulances';

export default function DashboardPage() {
    const [tab, setTab] = useState<Tab>('hospitals');
    const [emergencyType, setEmergencyType] = useState<EmergencyType>('cardiac');
    const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);
    const [dispatching, setDispatching] = useState(false);
    const router = useRouter();

    const filteredHospitals = filterHospitalsByType(emergencyType);
    const availableAmbulances = ambulances.filter(a => a.isAvailable);

    const handleHospitalSelect = (id: string) => {
        setSelectedHospitals(prev =>
            prev.includes(id) ? prev.filter(h => h !== id) : prev.length < 3 ? [...prev, id] : prev
        );
    };

    const handleDispatch = () => {
        setDispatching(true);
        setTimeout(() => router.push('/tracking'), 1500);
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
                    <StatusBadge status="active" size="lg" />
                    <div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px', color: 'var(--sp-text)' }}>
                            SOS Professional Dashboard
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>
                            Alex Johnson · SOS Coordinator · New Delhi
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {selectedHospitals.length > 0 && (
                        <span style={{ fontSize: '12px', color: 'var(--sp-brand)', fontWeight: 600 }}>
                            {selectedHospitals.length}/3 selected
                        </span>
                    )}
                    <button
                        onClick={handleDispatch}
                        disabled={selectedHospitals.length === 0 || dispatching}
                        className="sp-btn-danger"
                        style={{
                            opacity: selectedHospitals.length === 0 ? 0.4 : 1,
                            fontSize: '13px', padding: '10px 24px',
                        }}
                    >
                        {dispatching ? '⚡ Dispatching…' : `🚨 Confirm Dispatch${selectedHospitals.length > 0 ? ` (${selectedHospitals.length})` : ''}`}
                    </button>
                </div>
            </div>

            {/* Main layout */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '400px 1fr', overflow: 'hidden' }}>

                {/* LEFT PANEL */}
                <div style={{ borderRight: '1px solid var(--sp-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Emergency type selector */}
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--sp-border)' }}>
                        <EmergencyTypeSelector selected={emergencyType} onSelect={setEmergencyType} />
                    </div>

                    {/* Tabs */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr',
                        borderBottom: '1px solid var(--sp-border)',
                    }}>
                        {(['hospitals', 'ambulances'] as Tab[]).map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{
                                padding: '12px',
                                border: 'none',
                                borderBottom: `2px solid ${tab === t ? 'var(--sp-brand)' : 'transparent'}`,
                                background: 'transparent',
                                color: tab === t ? 'var(--sp-brand)' : 'var(--sp-text-muted)',
                                fontWeight: tab === t ? 600 : 400,
                                cursor: 'pointer',
                                fontSize: '13px',
                                transition: 'all 0.15s',
                                textTransform: 'capitalize',
                            }}>
                                {t === 'hospitals' ? `🏥 Hospitals (${filteredHospitals.length})` : `🚑 Ambulances (${availableAmbulances.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Selection hint */}
                    {tab === 'hospitals' && (
                        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--sp-border)', background: 'rgba(0,212,170,0.04)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>
                                💡 Select up to 3 hospitals — parallel dispatch blast will be sent simultaneously
                            </p>
                        </div>
                    )}

                    {/* List */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tab === 'hospitals'
                            ? filteredHospitals.map(h => (
                                <HospitalCard
                                    key={h.id}
                                    hospital={h}
                                    selected={selectedHospitals.includes(h.id)}
                                    onSelect={handleHospitalSelect}
                                    showDispatchButton={false}
                                />
                            ))
                            : availableAmbulances.map(a => (
                                <AmbulanceCard key={a.id} ambulance={a} showActions />
                            ))
                        }
                    </div>
                </div>

                {/* RIGHT PANEL — Map */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MapPlaceholder
                        showRoute={selectedHospitals.length > 0}
                        showAmbulance={selectedHospitals.length > 0}
                        ambulanceEta={selectedHospitals.length > 0 ? 4 : undefined}
                        label="Emergency Zone — New Delhi"
                    />

                    {/* Quick stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {[
                            { icon: '🏥', label: 'Hospitals Matched', value: filteredHospitals.length.toString(), color: 'var(--sp-brand)' },
                            { icon: '🚑', label: 'Ambulances Ready', value: availableAmbulances.length.toString(), color: '#10b981' },
                            { icon: '⏱', label: 'Min ETA', value: '4 min', color: '#f59e0b' },
                            { icon: '📡', label: 'Dispatch Mode', value: 'Parallel', color: '#a855f7' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: 'var(--sp-surface-2)',
                                border: '1px solid var(--sp-border)',
                                borderRadius: '10px',
                                padding: '12px',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
                                <div style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '10px', color: 'var(--sp-text-muted)', marginTop: '2px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
