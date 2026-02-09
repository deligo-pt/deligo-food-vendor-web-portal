/* eslint-disable @typescript-eslint/no-explicit-any */
// Vendor Customer Insights — Ultra Premium (Glovo/UberEats level)
// Next.js + TypeScript + Tailwind + shadcn
// File: app/vendor/customer-insights/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useTranslation } from "@/src/hooks/use-translation";
import { Activity, Clock, MapPin, PieChart, Users } from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const GRADIENT = "linear-gradient(135deg,#FFDDEB,#FFFFFF)";

/* ---------------------------
   Mock Data (static)
----------------------------*/
const DEMOGRAPHICS = {
  totalCustomers: 5420,
  newCustomers: 820,
  returningCustomers: 4600,
  topCities: [
    { city: "Lisbon", pct: 42 },
    { city: "Porto", pct: 28 },
    { city: "Coimbra", pct: 8 },
  ],
  avgOrderFreq: 3.4, // per month
};

const WEEK_HOUR_HEAT = [
  // each array is 24 hours heat value for a day Mon-Sun
  [
    1, 1, 1, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 20, 18, 16, 14, 12, 10,
    8, 4, 2,
  ], // Mon
  [
    1, 1, 1, 1, 2, 4, 6, 8, 11, 13, 15, 17, 19, 21, 23, 21, 19, 17, 15, 13, 11,
    8, 4, 2,
  ], // Tue
  [
    1, 1, 1, 1, 2, 4, 6, 8, 12, 14, 16, 18, 20, 22, 24, 22, 20, 18, 16, 14, 12,
    9, 4, 2,
  ], // Wed
  [
    1, 1, 1, 1, 2, 4, 6, 8, 14, 16, 18, 20, 22, 24, 26, 24, 22, 20, 18, 16, 14,
    10, 4, 2,
  ], // Thu
  [
    1, 1, 1, 1, 2, 4, 6, 8, 18, 20, 22, 24, 26, 28, 30, 28, 26, 24, 22, 20, 16,
    12, 6, 2,
  ], // Fri
  [
    1, 1, 1, 1, 2, 4, 6, 8, 20, 22, 24, 26, 28, 30, 32, 30, 28, 26, 24, 22, 18,
    14, 8, 3,
  ], // Sat
  [
    1, 1, 1, 1, 2, 4, 6, 8, 16, 18, 20, 22, 24, 26, 28, 26, 24, 22, 20, 18, 14,
    10, 6, 2,
  ], // Sun
];

const CUSTOMER_VALUE = [
  { name: "Top 1%", count: 54, avg: 42.3 },
  { name: "Top 5%", count: 271, avg: 28.9 },
  { name: "Top 10%", count: 542, avg: 18.7 },
];

const REVIEWS = [
  { text: "fast delivery", weight: 18 },
  { text: "too salty", weight: 9 },
  { text: "friendly rider", weight: 12 },
  { text: "great portion", weight: 11 },
  { text: "cold food", weight: 7 },
  { text: "on time", weight: 15 },
  { text: "recommend", weight: 10 },
];

const WEEKLY_RETENTION = [
  { label: "Week 1", pct: 45 },
  { label: "Week 2", pct: 37 },
  { label: "Week 3", pct: 33 },
  { label: "Week 4", pct: 30 },
];

/* ---------------------------
   Helper Components
----------------------------*/
function StatCard({ title, value, hint, icon }: any) {
  return (
    <Card className="rounded-2xl border" style={{ background: GRADIENT }}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="p-3 rounded-lg bg-white/60">{icon}</div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
          {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function LineSpark({
  data,
  color = PRIMARY,
}: {
  data: number[];
  color?: string;
}) {
  // simple SVG sparkline
  const width = 260;
  const height = 60;
  const max = Math.max(...data);
  const points = data
    .map(
      (d, i) =>
        `${(i / (data.length - 1)) * width},${height - (d / max) * (height - 8)}`,
    )
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Heatmap({ grid }: { grid: number[][] }) {
  // grid: [day][hour]
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const max = Math.max(...grid.flat());

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-24 gap-1">
        {/* header hours */}
        <div className="col-span-24 flex gap-1 mb-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1 text-xs text-center text-gray-500">
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="flex items-center gap-2">
            <div className="w-12 text-sm text-gray-700">{days[rIdx]}</div>
            <div className="flex-1 flex gap-1">
              {row.map((v, c) => {
                const intensity = Math.round((v / max) * 255);
                const bg = `rgb(255, ${255 - Math.round(intensity / 1.5)}, ${255 - intensity})`;
                return (
                  <div
                    key={c}
                    title={`${v} orders`}
                    className="flex-1 h-6 rounded-sm"
                    style={{ background: bg }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------
   Main Page
----------------------------*/
export default function CustomerInsightsPage() {
  const { t } = useTranslation();
  // sample sparkline data
  const retention = WEEKLY_RETENTION.map((w) => w.pct);
  const sparkData = [12, 18, 9, 22, 27, 25, 30, 28, 35, 32];

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              {t("customer_insights")}
            </h1>
            <p className="text-gray-600 mt-1">{t("deep_customer_analytics")}</p>
          </div>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Search customers or segments..."
              className="max-w-sm"
            />
            <Button style={{ background: PRIMARY }} className="text-white">
              {t("export_csv")}
            </Button>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title={t("total_customers")}
            value={DEMOGRAPHICS.totalCustomers}
            hint={`${DEMOGRAPHICS.newCustomers} new`}
            icon={<Users size={20} />}
          />
          <StatCard
            title={t("returning")}
            value={DEMOGRAPHICS.returningCustomers}
            hint={`Avg orders/month ${DEMOGRAPHICS.avgOrderFreq}`}
            icon={<Activity size={20} />}
          />
          <StatCard
            title={t("top_city")}
            value={DEMOGRAPHICS.topCities[0].city}
            hint={`${DEMOGRAPHICS.topCities[0].pct}% of orders`}
            icon={<MapPin size={20} />}
          />
          <StatCard
            title={t("avg_repeat")}
            value={`${((DEMOGRAPHICS.returningCustomers / DEMOGRAPHICS.totalCustomers) * 100).toFixed(0)}%`}
            hint={`Retention`}
            icon={<Clock size={20} />}
          />
        </div>

        {/* DEMOGRAPHICS + RETENTION ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="text-gray-700" />{" "}
                  <h3 className="font-bold">{t("demographics")}</h3>
                </div>
                <Badge>{t("live")}</Badge>
              </div>

              <div className="space-y-3">
                {DEMOGRAPHICS.topCities.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.city}</div>
                      <div className="text-xs text-gray-500">
                        {c.pct}% {t("of_orders")}
                      </div>
                    </div>
                    <div className="text-sm text-gray-800">{c.pct}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PieChart className="text-gray-700" />{" "}
                  <h3 className="font-bold">{t("customer_value")}</h3>
                </div>
                <Badge variant="outline">{t("top_segments")}</Badge>
              </div>

              <div className="space-y-3">
                {CUSTOMER_VALUE.map((cv, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{cv.name}</div>
                      <div className="text-xs text-gray-500">
                        {t("avg_order")} €{cv.avg.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-800">{cv.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-700" />{" "}
                  <h3 className="font-bold">{t("retention_trend")}</h3>
                </div>
                <Badge variant="secondary">{t("d_7")}</Badge>
              </div>

              <div className="mb-2">
                <LineSpark data={retention} color={PRIMARY} />
              </div>

              <div className="grid grid-cols-4 text-center text-sm text-gray-600">
                {WEEKLY_RETENTION.map((w, i) => (
                  <div key={i}>
                    <div className="font-semibold">{w.pct}%</div>
                    <div className="text-xs">{w.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BEHAVIOR HEATMAP & REVIEWS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-700" />{" "}
                  <h3 className="font-bold">{t("peak_order_times")}</h3>
                </div>
                <div className="text-sm text-gray-500">{t("local_time")}</div>
              </div>

              <Heatmap grid={WEEK_HOUR_HEAT} />
            </CardContent>
          </Card>
        </div>

        {/* ACTIONABLE INSIGHTS */}
        <Card className="rounded-2xl border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="text-gray-700" />{" "}
                <h3 className="font-bold">{t("actionable_insights")}</h3>
              </div>
              <Badge variant="outline">{t("ai_suggest")}</Badge>
            </div>

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>{t("promote_popular_items")}</li>
              <li>{t("target_top_customers_with_exclusive")}</li>
              <li>{t("address_cold_food_feedback")}</li>
              <li>{t("run_campaign_slow_days")}</li>
            </ul>

            <div className="mt-4 flex gap-3">
              <Button style={{ background: PRIMARY }} className="text-white">
                {t("create_campaign")}
              </Button>
              <Button variant="outline">{t("export_segment")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
