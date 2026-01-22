"use client";

import { useTranslation } from "@/src/hooks/use-translation";

type StatCard = {
  id: string;
  title: string;
  value: string;
  meta: string;
  trend: "up" | "down" | "neutral";
  accent: "pink" | "indigo" | "emerald" | "amber";
};

const stats: StatCard[] = [
  {
    id: "orders",
    title: "Orders",
    value: "128",
    meta: "Today • Live updates",
    trend: "up",
    accent: "pink",
  },
  {
    id: "earnings",
    title: "Earnings",
    value: "€1,240",
    meta: "This week • Estimated",
    trend: "up",
    accent: "emerald",
  },
  {
    id: "prep",
    title: "Preparation Time",
    value: "14 min",
    meta: "Avg • Last 24 hours",
    trend: "down",
    accent: "amber",
  },
  {
    id: "ratings",
    title: "Ratings",
    value: "4.8",
    meta: "Customer feedback",
    trend: "up",
    accent: "indigo",
  },
];

function AccentDot({ accent }: { accent: StatCard["accent"] }) {
  const map = {
    pink: "bg-[#DC3173]",
    indigo: "bg-indigo-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-300",
  };

  return (
    <span
      className={`inline-flex h-2.5 w-2.5 rounded-full ${map[accent]} shadow-[0_0_18px_rgba(220,49,115,0.65)]`}
    />
  );
}

function TrendPill({ trend }: { trend: StatCard["trend"] }) {
  const { t } = useTranslation();

  if (trend === "neutral") {
    return (
      <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/70">
        {t("stable")}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${trend === "up"
        ? "border border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
        : "border border-amber-300/20 bg-amber-400/10 text-amber-200"
        }`}
    >
      {trend === "up" ? (
        <>
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 14l5-5 5 5H7z" />
          </svg>
          {t("improving")}
        </>
      ) : (
        <>
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
          {t("faster")}
        </>
      )}
    </span>
  );
}

export default function VendorDashboardPreview() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20">
      {/* ===== Background (Premium dark + brand glow) ===== */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-[#0B0B12] via-[#140A16] to-[#070B1D]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(220,49,115,0.50),transparent_55%),radial-gradient(circle_at_85%_75%,rgba(99,102,241,0.32),transparent_55%),radial-gradient(circle_at_40%_90%,rgba(255,255,255,0.10),transparent_55%)]" />

        {/* Animated blobs */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#DC3173]/22 blur-3xl animate-[floatSlow_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-indigo-500/18 blur-3xl animate-[floatSlow_12s_ease-in-out_infinite]" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.22) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== Header ===== */}
        <div className="mb-10 sm:mb-12 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#DC3173]" />
            {t("live_dashboard_preview")}
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("your_vendor_dashboard")}{" "}
            <span className="bg-linear-to-r from-[#DC3173] via-pink-200 to-indigo-200 bg-clip-text text-transparent">
              {t("at_a_glance")}
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
            {t("clean_real_time_overview_built")}
          </p>
        </div>

        {/* ===== Main Preview Card ===== */}
        <div
          className="relative mx-auto overflow-hidden rounded-[34px] border border-white/12 bg-white/6 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8"
          style={{ animation: "fadeUp 650ms ease both" }}
        >
          {/* Border glow */}
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -inset-0.5 rounded-[36px] bg-[linear-gradient(120deg,rgba(220,49,115,0.45),rgba(99,102,241,0.25),rgba(255,255,255,0.08))] blur-xl" />
          </div>

          <div className="relative">
            {/* Top bar */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  {t("dashboard_snapshot")}
                </h3>
              </div>

              {/* Mini status */}
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-xl">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {t("live_tracking_enabled")}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-5 text-left shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                  style={{
                    animation: `fadeUp 650ms ease ${index * 80}ms both`,
                  }}
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -inset-8 bg-[radial-gradient(circle_at_30%_20%,rgba(220,49,115,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.20),transparent_45%)] blur-2xl" />
                  </div>

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AccentDot accent={item.accent} />
                      <p className="text-sm font-semibold text-white/90">
                        {item.title}
                      </p>
                    </div>

                    <TrendPill trend={item.trend} />
                  </div>

                  <div className="relative mt-4">
                    <p className="text-3xl font-extrabold tracking-tight text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-white/65">{item.meta}</p>
                  </div>

                  {/* tiny line */}
                  <div className="relative mt-5 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

                  <div className="relative mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/60">
                      {t("quick_preview")}
                    </span>


                  </div>
                </button>
              ))}
            </div>
          </div>
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
