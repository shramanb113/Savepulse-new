"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HospitalPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/emergency_dashboard_hospital");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white font-mono">
      Redirecting to Command Center...
    </div>
  );
}
