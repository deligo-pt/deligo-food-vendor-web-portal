"use client";

import { useTranslation } from "@/src/hooks/use-translation";

type TrustCard = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const cards: TrustCard[] = [
  {
    id: "secure-payments",
    title: "Secure Payments",
    desc: "End-to-end secure transactions with reliable payment handling.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 1l9 4v6c0 5-3.8 9.7-9 11-5.2-1.3-9-6-9-11V5l9-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "data-protection",
    title: "Data Protection",
    desc: "Customer and business data protected with strict access controls.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 3a6 6 0 0 0-6 6v3H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1V9a6 6 0 0 0-6-6z" />
        <path d="M8 12V9a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
  {
    id: "verified-vendors",
    title: "Verified Vendors",
    desc: "Vendor onboarding with verification steps to ensure quality partners.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14" />
        <path d="M9 21V9h6v12" />
        <path d="M10 12h4" />
      </svg>
    ),
  },
  {
    id: "fraud-monitoring",
    title: "Fraud Monitoring",
    desc: "Smart checks to detect unusual activity and reduce risk for vendors.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 3v18h18" />
        <path d="M7 14l3-3 3 2 5-6" />
        <path d="M16 7h2v2" />
      </svg>
    ),
  },
];

export default function SecurityTrustSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20">
      {/* ===== Premium Background ===== */}
      <div className="absolute inset-0 -z-10">
        {/* Dark base */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0B0B12] via-[#0E0A16] to-[#070B1D]" />

        {/* Brand glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,49,115,0.45),transparent_55%),radial-gradient(circle_at_85%_70%,rgba(99,102,241,0.32),transparent_55%)]" />

        {/* Floating blobs */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#DC3173]/20 blur-3xl animate-[floatSlow_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-[floatSlow_12s_ease-in-out_infinite]" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.18) 1px, transparent 1px)",
              backgroundSize: "85px 85px",
            }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== Header ===== */}
        <div className="mb-10 sm:mb-12 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#DC3173]" />
            {t("security_and_trust")}
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("built_for")}{" "}
            <span className="bg-linear-to-r from-[#DC3173] via-pink-200 to-indigo-200 bg-clip-text text-transparent">
              {t("secure_operations")}
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
            {t("deligo_designed_security_first_principles")}
          </p>
        </div>

        {/* ===== Cards ===== */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-white/6 p-6 shadow-[0_22px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25"
              style={{
                animation: `fadeUp 650ms ease ${index * 80}ms both`,
              }}
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -inset-10 rounded-[40px] bg-[radial-gradient(circle_at_20%_20%,rgba(220,49,115,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.20),transparent_45%)] blur-2xl" />
              </div>

              {/* Icon */}
              <div className="relative flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-[#DC3173]">{card.icon}</span>
                </div>

                {/* tiny dot */}
                <span className="relative h-2.5 w-2.5 rounded-full bg-[#DC3173] shadow-[0_0_18px_rgba(220,49,115,0.65)]" />
              </div>

              {/* Title */}
              <h3 className="relative mt-5 text-lg font-bold text-white">
                {card.title}
              </h3>

              {/* Desc */}
              <p className="relative mt-2 text-sm leading-relaxed text-white/70">
                {card.desc}
              </p>

              {/* Divider */}
              <div className="relative mt-6 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

              {/* Bottom hint */}
              <p className="relative mt-4 text-xs font-medium text-white/60">
                {t("trusted_by_modern_platforms")}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-white/65">
            {t("security_continuous_monitor_improve")}
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}
