"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import Image from "next/image";

type Category = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
};

const categories: Category[] = [
  {
    id: "burgers",
    title: "Burgers",
    subtitle: "Juicy, cheesy & fast",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80&auto=format&fit=crop",
    badge: "Popular",
  },
  {
    id: "pizza",
    title: "Pizza",
    subtitle: "Hot, fresh & loaded",
    image:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=1200&q=80&auto=format&fit=crop",
    badge: "Trending",
  },
  {
    id: "healthy",
    title: "Healthy",
    subtitle: "Fit meals everyday",
    image:
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "asian",
    title: "Asian",
    subtitle: "Spicy & flavorful",
    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=1200&q=80&auto=format&fit=crop",
    badge: "New",
  },
  {
    id: "coffee",
    title: "Coffee",
    subtitle: "Boost your mood",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "desserts",
    title: "Desserts",
    subtitle: "Sweet treats",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80&auto=format&fit=crop",
    badge: "Chef’s Pick",
  },
];

export default function ExploreFoodCategories() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20">
      {/* ===== Animated Premium Background ===== */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-[#0B0B12] via-[#140A16] to-[#070B1D]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(220,49,115,0.50),transparent_55%),radial-gradient(circle_at_85%_75%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(circle_at_40%_90%,rgba(255,255,255,0.10),transparent_55%)]" />

        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#DC3173]/25 blur-3xl animate-[floatSlow_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-[floatSlow_12s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl animate-[floatSlow_14s_ease-in-out_infinite]" />

        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.25) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== Header ===== */}
        <div className="mb-10 sm:mb-12 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#DC3173]" />
            {t("explore_menu_categories")}
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("explore_food")}{" "}
            <span className="bg-linear-to-r from-[#DC3173] via-pink-300 to-indigo-300 bg-clip-text text-transparent">
              {t("categories")}
            </span>
          </h2>
        </div>

        {/* ===== Grid ===== */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              type="button"
              className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-white/6 text-left shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC3173]/70"
              style={{ animation: `fadeUp 600ms ease ${index * 70}ms both` }}
            >
              {/* Glow hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -inset-10 rounded-[40px] bg-[radial-gradient(circle_at_20%_20%,rgba(220,49,115,0.45),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.25),transparent_45%)] blur-2xl" />
              </div>

              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.12]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-br from-[#DC3173]/30 via-transparent to-indigo-500/25" />

                {cat.badge && (
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xl">
                    {cat.badge}
                  </span>
                )}

                <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-white/10 opacity-0 blur-xl transition-all duration-700 group-hover:left-full group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="relative p-5">
                <div className="absolute -top-5 right-5 grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.72 4.22a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H3a.75.75 0 0 1 0-1.5h15.38l-4.72-4.72a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                <p className="mt-1 text-sm text-white/75">{cat.subtitle}</p>

                <div className="mt-5 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs font-medium text-white/70">
                    {t("category_preview")}
                  </p>

                  <span className="text-xs font-semibold text-[#DC3173] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {t("nice")}
                  </span>
                </div>
              </div>
            </button>
          ))}
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
