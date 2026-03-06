'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/', label: 'Emergency', role: 'Patient' },
    { href: '/dashboard', label: 'Dashboard', role: 'SOS Pro' },
    { href: '/tracking', label: 'Tracking', role: 'Patient' },
    { href: '/driver', label: 'Driver App', role: 'Driver' },
    { href: '/hospital', label: 'Hospital', role: 'Hospital' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header
            style={{
                background: 'rgba(8,8,16,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--sp-border)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            <nav
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 24px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Pulsing logo dot */}
                    <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                        <div
                            style={{
                                width: '32px', height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #00d4aa, #00b894)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '16px',
                                animation: 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
                            }}
                        >
                            🚑
                        </div>
                    </div>
                    <div>
                        <span
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 800,
                                fontSize: '18px',
                                background: 'linear-gradient(90deg, #00d4aa, #00b894)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.3px',
                            }}
                        >
                            SavePulse
                        </span>
                    </div>
                </Link>

                {/* Nav links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {navLinks.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    textDecoration: 'none',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? '#000' : 'var(--sp-text-muted)',
                                    background: isActive ? 'var(--sp-brand)' : 'transparent',
                                    transition: 'all 0.15s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1px',
                                }}
                            >
                                <span>{link.label}</span>
                                <span style={{ fontSize: '9px', opacity: 0.6, fontWeight: 400, color: isActive ? '#000' : 'var(--sp-text-dim)' }}>
                                    {link.role}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Live indicator */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                >
                    <span className="sp-dot-live" />
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 500 }}>LIVE</span>
                </div>
            </nav>
        </header>
    );
}
