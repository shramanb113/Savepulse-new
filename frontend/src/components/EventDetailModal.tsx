"use client";

import { SOSAlert } from "@/app/emergency_dashboard_hospital/page";

interface Props {
  alert: SOSAlert;
  onClose: () => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const SEVERITY_LABELS: Record<number, string> = {
  1: "CRITICAL",
  2: "HIGH",
  3: "MODERATE",
};

const SEVERITY_COLORS: Record<number, string> = {
  1: "critical",
  2: "amber-text",
  3: "blue-text",
};

export default function EmergencyDetailModal({ alert, onClose, onAccept, onDecline }: Props) {
  const isPending = alert.status === "pending" || alert.status === "dispatched";
  const severityLabel = SEVERITY_LABELS[alert.severity_level];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            Emergency Detail — {alert.request_id}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div className="modal-field">
              <div className="modal-field-label">Patient Name</div>
              <div className="modal-field-value">{alert.patient_name}</div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">User ID</div>
              <div className="modal-field-value">{alert.user_id}</div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">Emergency Type</div>
              <div className="modal-field-value critical">{alert.emergency_type}</div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">Severity</div>
              <div className={`modal-field-value ${SEVERITY_COLORS[alert.severity_level]}`}>
                {severityLabel}
              </div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">Distance</div>
              <div className="modal-field-value">{alert.distance_km} km away</div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">Ambulance ETA</div>
              <div className="modal-field-value">{alert.eta_minutes} minutes</div>
            </div>
            <div className="modal-field" style={{ gridColumn: "1 / -1" }}>
              <div className="modal-field-label">GPS Coordinates</div>
              <div className="modal-field-value coords">
                {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
              </div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">Status</div>
              <div className="modal-field-value">{alert.status.toUpperCase()}</div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">Received At</div>
              <div className="modal-field-value" style={{ fontSize: "13px" }}>
                {new Date(alert.timestamp).toLocaleTimeString("en-IN", { hour12: false })}
              </div>
            </div>
          </div>
        </div>

        {isPending && (
          <div className="modal-actions">
            <button
              className="btn btn-accept btn-lg"
              onClick={() => onAccept(alert.request_id)}
            >
              ✓ Accept & Dispatch Ambulance
            </button>
            <button
              className="btn btn-decline btn-lg"
              onClick={() => onDecline(alert.request_id)}
            >
              ✕ Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}