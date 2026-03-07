"use client";
import "./dashboard.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SOSAlertCard from "@/components/SOSAlertCard";
import EmergencyDetailModal from "@/components/EventDetailModal";

export type AlertStatus = "dispatched" | "accepted" | "declined" | "pending";

export interface SOSAlert {
  request_id: string;
  user_id: string;
  patient_name: string;
  latitude: number;
  longitude: number;
  emergency_type: string;
  severity_level: number;
  status: AlertStatus;
  request_timestamp: string;
  timestamp: string;      // Unified timestamp for components
  distance_km: string;    // Calculated distance (formatted string)
  eta_minutes: number;    // Estimated arrival
}

export default function EmergencyDashboard() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [hospital, setHospital] = useState<any>(null);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // 1. Auth & Hospital Profile
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("http://localhost:3001/hospital/profile", { credentials: "include" });
        if (res.status === 401) {
          router.push("/hospitalLogin");
          return;
        }
        if (res.ok) {
          setHospital(await res.json());
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  // 2. Fetch Live Requests (Polling)
  useEffect(() => {
    if (!hospital) return;

    async function fetchRequests() {
      try {
        const res = await fetch("http://localhost:3001/hospital/requests", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          // Map backend timestamp to frontend format
          setAlerts(data.map((a: any) => ({
            ...a,
            request_id: String(a.request_id),
            status: a.status as AlertStatus,
            timestamp: a.request_timestamp,
            distance_km: (Math.random() * 3 + 0.5).toFixed(1), // Mock distance for UI
            eta_minutes: Math.floor(Math.random() * 10 + 2),   // Mock ETA for UI
          })));
        }
      } catch (err) {
        console.error("Fetch requests error:", err);
      }
    }

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [hospital]);

  // 3. Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/hospital/requests/${id}/accept`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.request_id !== id));
        // Refresh hospital profile to see updated bed counts
        const profRes = await fetch("http://localhost:3001/hospital/profile", { credentials: "include" });
        if (profRes.ok) setHospital(await profRes.json());
      }
    } catch (err) {
      console.error("Accept error:", err);
    }
    setSelectedAlert(null);
  };

  const handleDecline = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/hospital/requests/${id}/decline`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.request_id !== id));
      }
    } catch (err) {
      console.error("Decline error:", err);
    }
    setSelectedAlert(null);
  };

  const updateBeds = async (type: string, delta: number) => {
    if (!hospital) return;
    const keyMap: any = {
      icu: "icu_beds_available",
      general: "general_beds_available",
      oxygen: "oxygen_beds_available"
    };
    const key = keyMap[type];
    const newValue = Math.max(0, (hospital[key] || 0) + delta);

    try {
      const res = await fetch("http://localhost:3001/hospital/beds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [key]: newValue }),
      });
      if (res.ok) {
        setHospital((prev: any) => ({ ...prev, [key]: newValue }));
      }
    } catch (err) {
      console.error("Update beds error:", err);
    }
  };

  if (loading) return <div className="loading-screen">Authenticating Command Center...</div>;
  if (!hospital) return null;

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">+</div>
          <div>
            <div className="header-title">SAVE<span>PULSE</span> — EMERGENCY COMMAND</div>
            <div className="header-subtitle">Hospital Dispatch Interface · Live Mode</div>
          </div>
        </div>
        <div className="header-right">
          <div className="live-badge"><div className="live-dot" />Live Feed</div>
          <div className="clock">{currentTime.toLocaleTimeString("en-IN", { hour12: false })}</div>
          <div className="hospital-tag">{hospital.hospital_name}<br />ID: {hospital.hospital_id}</div>
        </div>
      </header>

      <div className="metrics-bar">
        <div className="metric-cell">
          <div className="metric-label">Pending SOS</div>
          <div className="metric-value red">{alerts.length.toString().padStart(2, "0")}</div>
          <div className="metric-sub">Awaiting response</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">ICU Beds</div>
          <div className="metric-value amber">{hospital.icu_beds_available?.toString().padStart(2, "0")}</div>
          <div className="metric-sub">Available now</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">General Beds</div>
          <div className="metric-value green">{hospital.general_beds_available?.toString().padStart(2, "0")}</div>
          <div className="metric-sub">Available now</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Oxygen Beds</div>
          <div className="metric-value blue">{hospital.oxygen_beds_available?.toString().padStart(2, "0")}</div>
          <div className="metric-sub">Available now</div>
        </div>
      </div>

      <div className="main">
        <div className="alerts-panel" style={{ flex: 2 }}>
          <div className="panel-header">
            <div className="panel-title">Incoming SOS Alerts</div>
            {alerts.length > 0 && <div className="alert-count">{alerts.length} ACTIVE</div>}
          </div>
          <div className="alerts-list">
            {alerts.length === 0 ? (
              <div className="no-alerts">Standing by for incoming emergency requests...</div>
            ) : (
              alerts.map((alert) => (
                <SOSAlertCard
                  key={alert.request_id}
                  alert={alert}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onViewDetails={() => setSelectedAlert(alert)}
                />
              ))
            )}
          </div>
        </div>

        <div className="sidebar" style={{ flex: 1 }}>
          <div className="sidebar-section">
            <div className="sidebar-title">Bed Management (Manual)</div>
            <div className="bed-control">
              <span>ICU Beds</span>
              <div className="btn-group">
                <button onClick={() => updateBeds("icu", -1)}>-</button>
                <button onClick={() => updateBeds("icu", 1)}>+</button>
              </div>
            </div>
            <div className="bed-control">
              <span>General Beds</span>
              <div className="btn-group">
                <button onClick={() => updateBeds("general", -1)}>-</button>
                <button onClick={() => updateBeds("general", 1)}>+</button>
              </div>
            </div>
            <div className="bed-control">
              <span>Oxygen Beds</span>
              <div className="btn-group">
                <button onClick={() => updateBeds("oxygen", -1)}>-</button>
                <button onClick={() => updateBeds("oxygen", 1)}>+</button>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Specializations</div>
            <div className="spec-item">
              <span>Trauma Center</span>
              <span className={`status-pill ${hospital.trauma_center ? "active" : "inactive"}`}>{hospital.trauma_center ? "YES" : "NO"}</span>
            </div>
            <div className="spec-item">
              <span>Cardiac Center</span>
              <span className={`status-pill ${hospital.cardiac_center ? "active" : "inactive"}`}>{hospital.cardiac_center ? "YES" : "NO"}</span>
            </div>
          </div>
        </div>
      </div>

      {selectedAlert && (
        <EmergencyDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}

      <style jsx>{`
        .loading-screen { min-height: 100vh; background: #080810; color: #fff; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 20px; }
        .no-alerts { padding: 40px; text-align: center; color: #666; font-style: italic; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed #333; margin-top: 20px; }
        .bed-control { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #222; }
        .bed-control span { color: #aaa; font-size: 14px; }
        .btn-group { display: flex; gap: 8px; }
        .btn-group button { background: #222; border: 1px solid #444; color: #fff; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .btn-group button:hover { background: #333; }
        .spec-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
        .status-pill { font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 10px; }
        .status-pill.active { background: #00d4aa; color: #000; }
        .status-pill.inactive { background: #333; color: #666; }
      `}</style>
    </div>
  );
}