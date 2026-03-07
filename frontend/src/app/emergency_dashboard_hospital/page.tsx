"use client";
import "./dashboard.css";
import "./dashboard.css";
import { useState, useEffect } from "react";
import SOSAlertCard from "@/components/SOSAlertCard";
import EmergencyDetailModal from "@/components/EventDetailModal";

export type AlertStatus = "pending" | "accepted" | "declined";
export type EmergencyType = "Cardiac Arrest" | "Trauma" | "Stroke" | "Respiratory" | "Burns" | "Unknown";

export interface SOSAlert {
  request_id: string;
  user_id: string;
  patient_name: string;
  latitude: number;
  longitude: number;
  emergency_type: EmergencyType;
  severity_level: 1 | 2 | 3;
  status: AlertStatus;
  timestamp: string;
  distance_km: number;
  eta_minutes: number;
}

const MOCK_ALERTS: SOSAlert[] = [
  {
    request_id: "SOS-001",
    user_id: "USR-441",
    patient_name: "Rahul Mehta",
    latitude: 22.5726,
    longitude: 88.3639,
    emergency_type: "Cardiac Arrest",
    severity_level: 1,
    status: "pending",
    timestamp: new Date(Date.now() - 45000).toISOString(),
    distance_km: 1.2,
    eta_minutes: 4,
  },
  {
    request_id: "SOS-002",
    user_id: "USR-882",
    patient_name: "Priya Sharma",
    latitude: 22.5812,
    longitude: 88.3712,
    emergency_type: "Stroke",
    severity_level: 1,
    status: "pending",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    distance_km: 2.7,
    eta_minutes: 8,
  },
  {
    request_id: "SOS-003",
    user_id: "USR-203",
    patient_name: "Amir Khan",
    latitude: 22.5601,
    longitude: 88.3501,
    emergency_type: "Trauma",
    severity_level: 2,
    status: "pending",
    timestamp: new Date(Date.now() - 210000).toISOString(),
    distance_km: 3.4,
    eta_minutes: 11,
  },
  {
    request_id: "SOS-004",
    user_id: "USR-317",
    patient_name: "Sunita Das",
    latitude: 22.5680,
    longitude: 88.3780,
    emergency_type: "Respiratory",
    severity_level: 2,
    status: "pending",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    distance_km: 4.1,
    eta_minutes: 14,
  },
  {
    request_id: "SOS-005",
    user_id: "USR-558",
    patient_name: "Dev Patel",
    latitude: 22.5900,
    longitude: 88.3850,
    emergency_type: "Burns",
    severity_level: 3,
    status: "pending",
    timestamp: new Date(Date.now() - 480000).toISOString(),
    distance_km: 5.9,
    eta_minutes: 19,
  },
];

export default function EmergencyDashboard() {
  const [alerts, setAlerts] = useState<SOSAlert[]>(MOCK_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newAlertPulse, setNewAlertPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const incoming = setTimeout(() => {
      const newAlert: SOSAlert = {
        request_id: "SOS-006",
        user_id: "USR-999",
        patient_name: "Ananya Roy",
        latitude: 22.5750,
        longitude: 88.3600,
        emergency_type: "Cardiac Arrest",
        severity_level: 1,
        status: "pending",
        timestamp: new Date().toISOString(),
        distance_km: 0.8,
        eta_minutes: 3,
      };
      setAlerts((prev) => [newAlert, ...prev]);
      setNewAlertPulse(true);
      setTimeout(() => setNewAlertPulse(false), 3000);
    }, 20000);
    return () => clearTimeout(incoming);
  }, []);

  const handleAccept = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.request_id === id ? { ...a, status: "accepted" as AlertStatus } : a))
    );
    setSelectedAlert(null);
  };

  const handleDecline = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.request_id === id ? { ...a, status: "declined" as AlertStatus } : a))
    );
    setSelectedAlert(null);
  };

  const pending = alerts.filter((a) => a.status === "pending");
  const accepted = alerts.filter((a) => a.status === "accepted");

  const sortedAlerts = [...alerts].sort((a, b) => {
    const statusOrder = { pending: 0, accepted: 1, declined: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status])
      return statusOrder[a.status] - statusOrder[b.status];
    if (a.severity_level !== b.severity_level)
      return a.severity_level - b.severity_level;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">+</div>
          <div>
            <div className="header-title">
              SAVE<span>PULSE</span> — EMERGENCY COMMAND
            </div>
            <div className="header-subtitle">Hospital Dispatch Interface · v2.1</div>
          </div>
        </div>
        <div className="header-right">
          <div className="live-badge">
            <div className="live-dot" />
            Live Feed
          </div>
          <div className="clock">
            {currentTime.toLocaleTimeString("en-IN", { hour12: false })}
          </div>
          <div className="hospital-tag">
            AIIMS Kolkata<br />Unit: EMRG-04
          </div>
        </div>
      </header>

      {/* METRICS BAR */}
      <div className="metrics-bar">
        <div className="metric-cell">
          <div className="metric-label">Pending SOS</div>
          <div className="metric-value red">{pending.length.toString().padStart(2, "0")}</div>
          <div className="metric-sub">Awaiting response</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Accepted</div>
          <div className="metric-value green">{accepted.length.toString().padStart(2, "0")}</div>
          <div className="metric-sub">Ambulance dispatched</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Ambulances Available</div>
          <div className="metric-value amber">06</div>
          <div className="metric-sub">of 10 units</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Avg Response Time</div>
          <div className="metric-value blue">24s</div>
          <div className="metric-sub">Target: &lt;30s ✓</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* ALERTS PANEL */}
        <div className="alerts-panel">
          <div className="panel-header">
            <div className="panel-title">Incoming SOS Alerts</div>
            {pending.length > 0 && (
              <div className="alert-count">{pending.length} ACTIVE</div>
            )}
          </div>
          <div className="alerts-list">
            {sortedAlerts.map((alert, i) => (
              <SOSAlertCard
                key={alert.request_id}
                alert={alert}
                isNew={i === 0 && newAlertPulse}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onViewDetails={() => setSelectedAlert(alert)}
              />
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Ambulance Fleet</div>
            <div className="resource-row">
              <span className="resource-label">Available</span>
              <span className="resource-count available">06</span>
            </div>
            <div className="resource-row">
              <span className="resource-label">On Mission</span>
              <span className="resource-count busy">04</span>
            </div>
            <div className="ambulance-bar">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`amb-unit ${i < 6 ? "available" : "dispatched"}`}>
                  🚑
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">ER Capacity</div>
            <div className="resource-row">
              <span className="resource-label">Trauma Bays</span>
              <span className="resource-count available">3</span>
            </div>
            <div className="resource-row">
              <span className="resource-label">ICU Beds</span>
              <span className="resource-count amber">2</span>
            </div>
            <div className="resource-row">
              <span className="resource-label">General ER</span>
              <span className="resource-count available">12</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Recent Activity</div>
            {[
              { text: "SOS-003 dispatched — Amb-07", time: "2 min ago" },
              { text: "SOS-001 accepted by Dr. Singh", time: "4 min ago" },
              { text: "Amb-03 returned to base", time: "9 min ago" },
              { text: "SOS-099 declined — no capacity", time: "14 min ago" },
            ].map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-text">{item.text}</div>
                <div className="activity-time">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* NEW ALERT BANNER */}
      {newAlertPulse && (
        <div className="new-alert-banner">⚡ NEW CRITICAL SOS INCOMING</div>
      )}

      {/* DETAIL MODAL */}
      {selectedAlert && (
        <EmergencyDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}

    </div>
  );
}