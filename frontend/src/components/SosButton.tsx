'use client';
import { useRouter } from 'next/navigation';

interface Props {
    onClick?: () => void;
}

export default function SosButton({ onClick }: Props) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) onClick();
        else router.push('/dashboard');
    };

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer glow rings */}
            <div style={{
                position: 'absolute',
                width: '140px', height: '140px',
                borderRadius: '50%',
                border: '2px solid rgba(255,59,59,0.15)',
                animation: 'pulse-danger 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
            }} />
            <div style={{
                position: 'absolute',
                width: '110px', height: '110px',
                borderRadius: '50%',
                border: '2px solid rgba(255,59,59,0.25)',
                animation: 'pulse-danger 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.4s infinite',
            }} />

            {/* Main SOS button */}
            <button
                onClick={handleClick}
                style={{
                    width: '120px', height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff3b3b, #cc2e2e)',
                    border: '3px solid rgba(255,100,100,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    boxShadow: '0 8px 40px rgba(255,59,59,0.4), 0 0 80px rgba(255,59,59,0.1)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: 'var(--font-heading)',
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 50px rgba(255,59,59,0.6), 0 0 100px rgba(255,59,59,0.15)';
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 40px rgba(255,59,59,0.4), 0 0 80px rgba(255,59,59,0.1)';
                }}
                onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'; }}
            >
                <span style={{ fontSize: '28px', marginBottom: '2px' }}>🆘</span>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '22px', letterSpacing: '3px' }}>SOS</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Tap to dispatch
                </span>
            </button>
        </div>
    );
}
