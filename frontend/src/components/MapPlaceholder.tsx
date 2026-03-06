'use client';

interface Props {
    showRoute?: boolean;
    showAmbulance?: boolean;
    ambulanceEta?: number;
    label?: string;
}

export default function MapPlaceholder({ showRoute = false, showAmbulance = false, ambulanceEta, label }: Props) {
    // Use a fixed viewBox so all coordinates are absolute pixel values — no percentage transforms
    const W = 800;
    const H = 500;

    // Named positions (absolute px within viewBox)
    const patient = { x: 385, y: 275 };
    const hosp1 = { x: 200, y: 150 };
    const hosp2 = { x: 480, y: 275 };
    const ambulance = { x: 575, y: 125 };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                minHeight: '320px',
                background: '#0b0b18',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--sp-border)',
            }}
        >
            {/* SVG Map */}
            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid slice"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Grid lines */}
                {Array.from({ length: 13 }).map((_, i) => (
                    <line key={`v${i}`}
                        x1={Math.round((i / 12) * W)} y1={0}
                        x2={Math.round((i / 12) * W)} y2={H}
                        stroke="#00d4aa" strokeWidth="0.5" opacity="0.2"
                    />
                ))}
                {Array.from({ length: 9 }).map((_, i) => (
                    <line key={`h${i}`}
                        x1={0} y1={Math.round((i / 8) * H)}
                        x2={W} y2={Math.round((i / 8) * H)}
                        stroke="#00d4aa" strokeWidth="0.5" opacity="0.2"
                    />
                ))}

                {/* Road lines */}
                <line x1="0" y1="210" x2={W} y2="230" stroke="#1a2a3a" strokeWidth="10" />
                <line x1="0" y1="340" x2={W} y2="325" stroke="#1a2a3a" strokeWidth="6" />
                <line x1="240" y1="0" x2="270" y2={H} stroke="#1a2a3a" strokeWidth="8" />
                <line x1="520" y1="0" x2="495" y2={H} stroke="#1a2a3a" strokeWidth="6" />

                {/* Road center dashes */}
                <line x1="0" y1="220" x2={W} y2="220" stroke="#2a3a4a" strokeWidth="1.5" strokeDasharray="20 12" opacity="0.6" />
                <line x1="255" y1="0" x2="255" y2={H} stroke="#2a3a4a" strokeWidth="1.5" strokeDasharray="20 12" opacity="0.6" />

                {/* Route line: ambulance → patient */}
                {showRoute && (
                    <line
                        x1={ambulance.x} y1={ambulance.y}
                        x2={patient.x} y2={patient.y}
                        stroke="#00d4aa" strokeWidth="2.5"
                        strokeDasharray="8 5"
                        opacity="0.9"
                    >
                        <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="0.8s" repeatCount="indefinite" />
                    </line>
                )}

                {/* Hospital 1 marker */}
                <circle cx={hosp1.x} cy={hosp1.y} r="18" fill="#1e1e30" stroke="#3b82f6" strokeWidth="1.5" opacity="0.9" />
                <text x={hosp1.x} y={hosp1.y + 6} textAnchor="middle" fontSize="16" fontFamily="sans-serif">🏥</text>

                {/* Hospital 2 marker */}
                <circle cx={hosp2.x} cy={hosp2.y} r="18" fill="#1e1e30" stroke="#3b82f6" strokeWidth="1.5" opacity="0.9" />
                <text x={hosp2.x} y={hosp2.y + 6} textAnchor="middle" fontSize="16" fontFamily="sans-serif">🏥</text>

                {/* Patient / user dot */}
                <circle cx={patient.x} cy={patient.y} r="20" fill="rgba(0,212,170,0.07)" stroke="rgba(0,212,170,0.25)" strokeWidth="1">
                    <animate attributeName="r" values="18;26;18" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={patient.x} cy={patient.y} r="9" fill="#00d4aa" />
                <circle cx={patient.x} cy={patient.y} r="4" fill="#fff" />

                {/* Ambulance marker */}
                {showAmbulance && (
                    <>
                        <circle cx={ambulance.x} cy={ambulance.y} r="20" fill="rgba(255,59,59,0.12)" stroke="#ff3b3b" strokeWidth="1.5">
                            <animate attributeName="r" values="18;28;18" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={ambulance.x} cy={ambulance.y} r="16" fill="#1a0010" stroke="#ff3b3b" strokeWidth="1" />
                        <text x={ambulance.x} y={ambulance.y + 6} textAnchor="middle" fontSize="16" fontFamily="sans-serif">🚑</text>
                    </>
                )}
            </svg>

            {/* Dark vignette overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,8,16,0.55) 100%)',
                pointerEvents: 'none',
            }} />

            {/* ETA callout at bottom */}
            {showAmbulance && ambulanceEta != null && (
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(8,8,16,0.92)',
                    border: '1px solid var(--sp-brand)',
                    borderRadius: '12px',
                    padding: '10px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backdropFilter: 'blur(10px)',
                    animation: 'slide-up 0.4s ease-out',
                    whiteSpace: 'nowrap',
                }}>
                    <span style={{ fontSize: '20px' }}>🚑</span>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--sp-brand)' }}>
                            ETA {ambulanceEta} min away
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--sp-text-muted)' }}>
                            Turn left on Ring Road → NH-8
                        </div>
                    </div>
                    <div style={{
                        padding: '4px 10px',
                        background: 'var(--sp-brand)',
                        color: '#000',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                    }}>
                        LIVE
                    </div>
                </div>
            )}

            {/* Location label top-left */}
            {label && (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(8,8,16,0.8)',
                    border: '1px solid var(--sp-border)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    color: 'var(--sp-text-muted)',
                    backdropFilter: 'blur(8px)',
                }}>
                    📍 {label}
                </div>
            )}

            {/* Zoom controls top-right */}
            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            }}>
                {['+', '−'].map(s => (
                    <div key={s} style={{
                        width: '28px', height: '28px',
                        background: 'rgba(8,8,16,0.85)',
                        border: '1px solid var(--sp-border)',
                        borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', color: 'var(--sp-text-muted)',
                        cursor: 'pointer',
                    }}>
                        {s}
                    </div>
                ))}
            </div>
        </div>
    );
}
