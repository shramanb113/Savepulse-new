"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function HospitalSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    hospitalName: "",
    email: "",
    traumaCenter: false,
    cardiac_center: false,
    icuBeds: 0,
    generalBeds: 0,
    oxygenBeds: 0,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Get Geolocation
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch("http://localhost:3001/hospital/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hospital_name: form.hospitalName,
            email: form.email,
            latitude: latitude,
            longitude: longitude,
            trauma_center: form.traumaCenter,
            cardiac_center: form.cardiac_center,
            icu_beds_available: Number(form.icuBeds),
            general_beds_available: Number(form.generalBeds),
            oxygen_beds_available: Number(form.oxygenBeds),
            total_beds: Number(form.icuBeds) + Number(form.generalBeds) + Number(form.oxygenBeds),
          }),
        });

        if (res.ok) {
          router.push("/hospital");
        } else {
          alert("Signup failed. Check console.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      alert("Location access is required to register.");
      setLoading(false);
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-24">
        {/* Hero */}
        <section className="rounded-3xl bg-gradient-to-br from-red-600 to-red-500 p-6 text-white shadow-lg">
          <p className="text-sm uppercase tracking-widest opacity-80">Partner Hospital</p>
          <h1 className="mt-1 text-3xl font-extrabold">Join SavePulse</h1>
          <p className="mt-1 text-sm opacity-90">Register your facility to the emergency network.</p>
        </section>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
          
          {/* Hospital Name */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Hospital Name</label>
            <input
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700"
              placeholder="City Care Hospital"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Admin Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700"
              placeholder="admin@hospital.com"
            />
          </div>

          {/* Specializations (Checkboxes) */}
          <div className="grid grid-cols-2 gap-4 py-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
              <input type="checkbox" name="traumaCenter" checked={form.traumaCenter} onChange={handleChange} className="accent-red-600" />
              Trauma Center
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
              <input type="checkbox" name="cardiac_center" checked={form.cardiac_center} onChange={handleChange} className="accent-red-600" />
              Cardiac Center
            </label>
          </div>

          {/* Bed Inventory */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase text-gray-400">Current Bed Availability</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-500">ICU</label>
                <input type="number" name="icuBeds" value={form.icuBeds} onChange={handleChange} className="w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500">GENERAL</label>
                <input type="number" name="generalBeds" value={form.generalBeds} onChange={handleChange} className="w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500">OXYGEN</label>
                <input type="number" name="oxygenBeds" value={form.oxygenBeds} onChange={handleChange} className="w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Getting Location..." : "Register Hospital"}
          </button>
        </form>
      </main>
      <BottomNav />
    </div>
  );
}