"use client";

import { SOSAlert } from "@/app/emergency_dashboard_hospital/page";

interface Props {
    alert: SOSAlert;
    isNew?: boolean;
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
    onViewDetails: () => void;
}

function timeAgo(timestamp: string): string {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}

const SEVERITY_LABELS: Record<number, string> = {
    1: "CRITICAL",
    2: "HIGH",
    3: "MODERATE",
};

export default function SOSAlertCard({ alert, isNew, onAccept, onDecline, onViewDetails }: Props) {
    const isPending = alert.status === "pending";

    const severityClass =
        alert.status === "accepted"
            ? "accepted"
            : alert.status === "declined"
                ? "declined"
                : `sev-${alert.severity_level}`;

    const cardClass = [
        "alert-card",
        isPending ? `severity-${alert.severity_level}` : alert.status,
        isNew ? "new-incoming" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const badgeLabel =
        alert.status === "accepted"
            ? "ACCEPTED"
            : alert.status === "declined"
                ? "DECLINED"
                : SEVERITY_LABELS[alert.severity_level];

    return (
        <div className={cardClass}>
            <div className="alert-top">
                <div className="alert-id">{alert.request_id}</div>
                <div className={`severity-badge ${severityClass}`}>{badgeLabel}</div>
            </div>

            <div className="alert-name">{alert.patient_name}</div>
            <div className="alert-type">{alert.emergency_type}</div>

            <div className="alert-meta">
                <span>📍 {alert.distance_km} km</span>
                <span>🕐 ETA {alert.eta_minutes} min</span>
                <span>🆔 {alert.user_id}</span>
            </div>

            {isPending && (
                <div className="alert-actions">
                    <button
                        className="btn btn-accept"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAccept(alert.request_id);
                        }}
                    >
                        ✓ Accept
                    </button>
                    <button
                        className="btn btn-details"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails();
                        }}
                    >
                        Details
                    </button>
                    <button
                        className="btn btn-decline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDecline(alert.request_id);
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="time-ago">{timeAgo(alert.timestamp)}</div>
        </div>
    );
}