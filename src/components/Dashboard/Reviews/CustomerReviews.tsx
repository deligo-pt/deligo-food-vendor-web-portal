"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TMeta } from "@/src/types";
import { TReview, TReviewSentiment } from "@/src/types/review.type";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Filter, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

interface IProps {
  reviewsResult: { data: TReview[]; meta?: TMeta };
}

export default function CustomerReviews({ reviewsResult }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sentimentParam = (searchParams.get("sentiment") || "ALL") as
    | TReviewSentiment
    | "ALL";

  const filterReviews = (sentiment: TReviewSentiment | "ALL") => {
    const params = new URLSearchParams(searchParams.toString());
    if (sentiment === "ALL") {
      params.delete("sentiment");
    } else {
      params.set("sentiment", sentiment);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-10">
        {/* --------------------------------------------------------- */}
        {/* HEADER */}
        {/* --------------------------------------------------------- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Customer Reviews
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Real feedback from your Glovo customers
            </p>
          </div>

          <Button
            className="flex items-center gap-2 text-white"
            style={{ background: PRIMARY }}
          >
            <Filter size={18} /> Export
          </Button>
        </div>

        {/* --------------------------------------------------------- */}
        {/* STATS SUMMARY */}
        {/* --------------------------------------------------------- */}
        <Card
          className="rounded-3xl bg-white border shadow-md"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Rating</p>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="text-5xl font-extrabold text-gray-900">4.3</h2>
                <span className="text-gray-500">/5</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Based on last 200 reviews
              </p>
            </div>

            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={26}
                  className={i <= 4 ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FILTER */}
        <div className="flex gap-3">
          <Button
            variant={sentimentParam === "ALL" ? "default" : "outline"}
            onClick={() => filterReviews("ALL")}
            className={sentimentParam === "ALL" ? "bg-[#DC3173]" : ""}
          >
            All
          </Button>
          <Button
            variant={sentimentParam === "POSITIVE" ? "default" : "outline"}
            onClick={() => filterReviews("POSITIVE")}
            className={sentimentParam === "POSITIVE" ? "bg-[#DC3173]" : ""}
          >
            Positive
          </Button>
          <Button
            variant={sentimentParam === "NEGATIVE" ? "default" : "outline"}
            onClick={() => filterReviews("NEGATIVE")}
            className={sentimentParam === "NEGATIVE" ? "bg-[#DC3173]" : ""}
          >
            Negative
          </Button>
          <Button
            variant={sentimentParam === "NEUTRAL" ? "default" : "outline"}
            onClick={() => filterReviews("NEUTRAL")}
            className={sentimentParam === "NEUTRAL" ? "bg-[#DC3173]" : ""}
          >
            Neutral
          </Button>
        </div>

        {/* --------------------------------------------------------- */}
        {/* REVIEWS LIST */}
        {/* --------------------------------------------------------- */}
        <div className="space-y-6">
          <AnimatePresence>
            {reviewsResult?.data?.map((rev) => (
              <motion.div
                key={rev._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
              >
                <Card className="rounded-3xl bg-white border shadow-sm hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex gap-5">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-xl font-bold text-pink-600">
                      {rev.reviewerId?.name?.firstName?.charAt(0)}
                      {rev.reviewerId?.name?.lastName?.charAt(0)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">
                          {rev.reviewerId?.name?.firstName}{" "}
                          {rev.reviewerId?.name?.lastName}
                        </h3>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Clock size={14} />{" "}
                          {formatDistanceToNow(rev.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i <= rev.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                        {rev.review}
                      </p>

                      {/* Like/Dislike */}
                      <div className="flex items-center gap-3 mt-3">
                        {rev.rating > 3 ? (
                          <Badge className="bg-green-100 text-green-700 flex gap-1">
                            <ThumbsUp size={14} /> Liked
                          </Badge>
                        ) : rev.rating === 3 ? (
                          <Badge className="bg-yellow-100 text-yellow-700 flex gap-1">
                            <ThumbsDown size={14} /> Neutral
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 flex gap-1">
                            <ThumbsDown size={14} /> Not great
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {reviewsResult?.meta?.total === 0 && (
            <p className="text-center text-gray-500 py-10 text-sm">
              No reviews found.
            </p>
          )}
        </div>

        {/* --------------------------------------------------------- */}
        {/* INSIGHTS */}
        {/* --------------------------------------------------------- */}
        {/* <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Insights</h2>
            </div>

            <Separator />

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>
                Fast delivery comments increased — strong delivery performance.
              </li>
              <li>
                Negative comments mostly about delays & cold food — optimize
                prep time.
              </li>
              <li>
                Most positive reviews mention rider friendliness — keep
                consistency.
              </li>
              <li>
                Weekend orders show a rating dip — consider peak-hour staffing
                boost.
              </li>
            </ul>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
