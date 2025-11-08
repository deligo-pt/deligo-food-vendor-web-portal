"use client";

import { useEffect, useState } from "react";
import { Globe2, Store, ShoppingBag, Headset } from "lucide-react";

const stats = [
  { id: 1, icon: ShoppingBag, label: "Orders Daily", value: 10000, suffix: "+" },
  { id: 2, icon: Store, label: "Active Vendors", value: 3000, suffix: "+" },
  { id: 3, icon: Globe2, label: "Cities in Portugal", value: 50, suffix: "+" },
  { id: 4, icon: Headset, label: "Support Languages", value: 2, suffix: "" },
];

export default function KeyMetrics() {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));

      const timer = setInterval(() => {
        start += 1;
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = start;
          return newCounts;
        });
        if (start === end) clearInterval(timer);
      }, stepTime);
      return timer;
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-24 px-6 sm:px-10 text-white"
      style={{
        background:
          "linear-gradient(135deg, #DC3173 0%, #8E2DE2 50%, #4A00E0 100%)",
      }}
    >
      {/* Subtle Parallax Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)] animate-pulse"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 drop-shadow-md">
          Our Growth & Impact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              className="relative bg-white/10 hover:bg-white/20 transition-all duration-500 p-8 rounded-2xl backdrop-blur-lg border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
            >
              <div className="flex justify-center mb-4">
                <stat.icon
                  className="w-12 h-12 text-[#FCE205] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
                {counts[i].toLocaleString()}
                {stat.suffix}
              </h3>
              <p className="text-lg font-medium text-gray-100">
                {stat.label}
              </p>

              {/* Neon hover ring effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#FCE205] transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
