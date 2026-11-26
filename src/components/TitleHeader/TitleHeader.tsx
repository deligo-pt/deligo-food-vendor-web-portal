"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LucideIcon, PlusIcon } from "lucide-react";
import { ReactNode } from "react";

interface IProps {
  title: string;
  subtitle?: string;
  buttonInfo?: {
    text: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  extraComponent?: ReactNode;
  /** A slim banner for list pages where the space belongs to the content. */
  compact?: boolean;
}

export default function TitleHeader({
  title,
  subtitle,
  buttonInfo,
  extraComponent,
  compact = false,
}: IProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`bg-linear-to-r from-[#DC3173] to-[#FF6CAB] rounded-lg shadow-lg ${compact ? "px-5 py-3 mb-3" : "p-6 mb-6"}`}>
        <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center ${compact ? "gap-2" : "gap-4"}`}>
          {/* `min-w-0` + `break-words`: on the row layout a long title — the
              add-item header now carries the product's name — would otherwise
              push the action button off the card instead of wrapping. */}
          <div className="min-w-0">
            <h1 className={`font-bold text-white break-words ${compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={compact ? "hidden text-sm text-pink-100 sm:block" : "text-pink-100 mt-1"}>{subtitle}</p>
            )}
          </div>
          <div>
            {buttonInfo && (
              <Button
                className="bg-white text-[#DC3173] hover:bg-slate-100 hover:text-[#DC3173]/90 px-4 py-2 rounded-md font-medium flex items-center gap-2 cursor-pointer print:hidden"
                onClick={buttonInfo.onClick}
              >
                {buttonInfo.icon ? (
                  <buttonInfo.icon className="h-5 w-5" />
                ) : (
                  <PlusIcon className="h-5 w-5" />
                )}
                {buttonInfo.text}
              </Button>
            )}
            {extraComponent ? extraComponent : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
