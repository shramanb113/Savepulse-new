'use client';
import { EmergencyType, emergencyTypes } from '@/lib/mockData';

interface Props {
    selected: EmergencyType;
    onSelect: (type: EmergencyType) => void;
}

export default function EmergencyTypeSelector({ selected, onSelect }: Props) {
    return (
        <div>
            <p style={{ fontSize: '11px', color: 'var(--sp-text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Emergency Type
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {emergencyTypes.map(et => {
                    const isSelected = selected === et.id;
                    return (
                        <button
                            key={et.id}
                            onClick={() => onSelect(et.id)}
                            style={{
                                background: isSelected ? `${et.color}18` : 'var(--sp-surface-3)',
                                border: `1px solid ${isSelected ? et.color : 'var(--sp-border)'}`,
                                borderRadius: '12px',
                                padding: '14px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s',
                                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: isSelected ? `0 0 16px ${et.color}22` : 'none',
                            }}
                        >
                            <span style={{ fontSize: '24px', lineHeight: 1 }}>{et.icon}</span>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: isSelected ? 700 : 500,
                                color: isSelected ? et.color : 'var(--sp-text-muted)',
                                textAlign: 'center',
                                lineHeight: '1.3',
                            }}>
                                {et.label}
                            </span>
                            {isSelected && (
                                <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: et.color,
                                    animation: 'dot-pulse 1.2s ease-in-out infinite',
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
