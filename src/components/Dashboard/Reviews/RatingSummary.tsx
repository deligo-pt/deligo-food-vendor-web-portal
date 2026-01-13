"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TRatingSummary, TStarPercentages } from "@/src/types/review.type";
import { motion } from "framer-motion";
import { Frown, Meh, Smile, Star } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";

// Mock ratings
const stars = [
  { name: "five", number: 5 },
  { name: "four", number: 4 },
  { name: "three", number: 3 },
  { name: "two", number: 2 },
  { name: "one", number: 1 },
];

export default function RatingSummary({
  summaryResult,
}: {
  summaryResult: TRatingSummary;
}) {
  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Rating Summary
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Customer satisfaction overview + advanced analytics
            </p>
          </div>

          {/* <Button className="text-white" style={{ background: PRIMARY }}>
            Export
          </Button> */}
        </div>

        {/* MAIN RATING BLOCK */}
        <Card className="rounded-3xl bg-white shadow-xl border">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">Overall Rating</p>
              <h2 className="text-7xl font-extrabold text-gray-900">
                {summaryResult?.summary?.avgRating}
              </h2>
              <div className="flex items-center gap-1 mt-2 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={26}
                    className={
                      i <= summaryResult?.summary?.avgRating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              {/* <p className="text-xs text-gray-400 mt-2">
                Based on last 200 reviews
              </p> */}
            </div>

            {/* Sentiment Circles */}
            <div className="flex gap-6">
              {/* Positive */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-400">
                  <Smile className="text-green-600" size={32} />
                </div>
                <p className="text-sm font-semibold mt-2">
                  {summaryResult?.summary?.sentimentPercentages?.positive}%
                  Positive
                </p>
              </div>

              {/* Neutral */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-400">
                  <Meh className="text-amber-600" size={32} />
                </div>
                <p className="text-sm font-semibold mt-2">
                  {summaryResult?.summary?.sentimentPercentages?.neutral}%
                  Neutral
                </p>
              </div>

              {/* Negative */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-400">
                  <Frown className="text-red-600" size={32} />
                </div>
                <p className="text-sm font-semibold mt-2">
                  {summaryResult?.summary?.sentimentPercentages?.negative}%
                  Negative
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STAR DISTRIBUTION */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-lg">Rating Breakdown</h2>
            <Separator />

            {stars.map((star, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-14 text-sm font-semibold">
                  {star.number} Stars
                </span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        summaryResult?.summary?.starPercentages?.[
                          star.name as keyof TStarPercentages
                        ]
                      }%`,
                    }}
                    transition={{ duration: 0.7, delay: idx * 0.1 }}
                    style={{ background: PRIMARY }}
                    className="h-full rounded-full"
                  />
                </div>
                <span className="w-10 text-sm text-gray-600">
                  {
                    summaryResult?.summary?.starPercentages?.[
                      star.name as keyof TStarPercentages
                    ]
                  }
                  %
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 30 DAY TREND */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-3">30-Day Rating Trend</h2>
            <Separator className="mb-4" />
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={summaryResult?.chart}>
                <Line
                  type="monotone"
                  dataKey="avgRatings"
                  stroke={PRIMARY}
                  strokeWidth={2}
                />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis />
                <YAxis dataKey="avgRatings" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CATEGORY RATINGS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-5">
            <h2 className="font-bold text-lg">Category Ratings</h2>
            <Separator />

            {Object.entries(summaryResult?.summary?.categoryRatings)?.map(
              ([key, val], i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{key}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className={
                          s <= val ? "text-yellow-400" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* AI INSIGHTS */}
        {/* <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Insights</h2>
            </div>

            <Separator />

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Delivery speed ratings improved by 12% in the last week.</li>
              <li>
                Negative reviews mostly happen after 10 PM — staffing issue
                possible.
              </li>
              <li>
                Food quality strong on weekends — consider weekday promotion.
              </li>
              <li>
                Packaging complaints decreased after recent update — keep
                consistency.
              </li>
            </ul>

            <div className="pt-2">
              <Button style={{ background: PRIMARY }} className="text-white">
                Improve Performance
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
