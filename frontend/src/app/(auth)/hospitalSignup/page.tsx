"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function HospitalSignup() {
  const router = useRouter();

  const [form, setForm] = useState({
    hospitalName: "",
    email: "",
    phone: "",
    address: "",
    beds: "",
    emergencyContact: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/hospital/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        name: form.hospitalName,
        email: form.email,
      })
    });

    const data = await res.json();
    console.log(data);
    router.push("/hospital");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
      <Header />

      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-24">

        {/* Hero */}
        <section className="rounded-3xl bg-gradient-to-br from-red-600 to-red-500 p-6 text-white shadow-lg">
          <p className="text-sm uppercase tracking-widest opacity-80">
            Partner Hospital
          </p>
          <h1 className="mt-1 text-3xl font-extrabold">
            Join SavePulse
          </h1>
          <p className="mt-1 text-sm opacity-90">
            Register your hospital to receive emergency dispatch requests.
          </p>
        </section>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900"
        >

          {/* Hospital Name */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
              Hospital Name
            </label>
            <input
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              placeholder="City Care Hospital"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              placeholder="hospital@email.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              placeholder="Hospital location"
            />
          </div>

          {/* Beds */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
              Available Beds
            </label>
            <input
              type="number"
              name="beds"
              value={form.beds}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              placeholder="50"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
              Emergency Contact
            </label>
            <input
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              placeholder="24/7 control room number"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700"
          >
            Register Hospital
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}