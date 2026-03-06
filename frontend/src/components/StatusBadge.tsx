'use client';
import { RequestStatus } from '@/lib/mockData';

interface Props {
    status: RequestStatus | 'active' | 'idle';
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { label: string; color: string; bg: string; pulse: boolean }> = {
    idle: { label: 'Idle', color: '#7070a0', bg: 'rgba(112,112,160,0.1)', pulse: false },
    pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', pulse: true },
    dispatching: { label: 'Dispatching…', color: '#00d4aa', bg: 'rgba(0,212,170,0.1)', pulse: true },
    confirmed: { label: 'Confirmed', color: '#10b981', bg: 'rgba(16,185,129,0.1)', pulse: true },
    arriving: { label: 'Arriving Soon', color: '#ff3b3b', bg: 'rgba(255,59,59,0.1)', pulse: true },
    completed: { label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.08)', pulse: false },
    active: { label: 'Emergency Active', color: '#ff3b3b', bg: 'rgba(255,59,59,0.1)', pulse: true },
};

const sizeConfig = {
    sm: { padding: '3px 8px', fontSize: '10px', dotSize: '6px', gap: '5px' },
    md: { padding: '5px 12px', fontSize: '12px', dotSize: '7px', gap: '6px' },
    lg: { padding: '8px 18px', fontSize: '14px', dotSize: '9px', gap: '8px' },
};

export default function StatusBadge({ status, size = 'md' }: Props) {
    const cfg = statusConfig[status] ?? statusConfig.idle;
    const sz = sizeConfig[size];

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: sz.gap,
            padding: sz.padding,
            borderRadius: '100px',
            background: cfg.bg,
            border: `1px solid ${cfg.color}30`,
        }}>
            <div style={{
                width: sz.dotSize,
                height: sz.dotSize,
                borderRadius: '50%',
                background: cfg.color,
                flexShrink: 0,
                animation: cfg.pulse ? 'dot-pulse 1.2s ease-in-out infinite' : 'none',
            }} />
            <span style={{
                fontSize: sz.fontSize,
                fontWeight: 600,
                color: cfg.color,
                whiteSpace: 'nowrap',
            }}>
                {cfg.label}
            </span>
        </div>
    );
}
