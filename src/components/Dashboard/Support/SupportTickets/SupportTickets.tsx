"use client";

import { Button } from "@/components/ui/button";
import CreateNewTicket from "@/src/components/Dashboard/Support/SupportTickets/CreateNewTicket";
import SupportChatSheet from "@/src/components/Dashboard/Support/SupportTickets/SupportChatSheet";
import SupportStatusBadge from "@/src/components/Dashboard/Support/SupportTickets/SupportStatusBadge";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { TMeta } from "@/src/types";
import { TSupportMessage, TSupportTicket } from "@/src/types/support.type";
import { removeUnderscore } from "@/src/utils/formatter";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Clock, MessageSquare, Tag } from "lucide-react";
import { useState } from "react";

interface IProps {
  ticket: TSupportTicket;
  userId: string;
  userName: string;
  initialMessagesData: { data: TSupportMessage[]; meta?: TMeta };
}

export default function SupportTickets({
  ticket,
  initialMessagesData,
}: IProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <TitleHeader
        title="Chat With Support"
        subtitle="Chat directly with our support experts with support ticket"
      />

      <div>
        <AnimatePresence mode="popLayout">
          {ticket?.ticketId ? (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-mono font-semibold tracking-wider">
                      #{ticket.ticketId}
                    </span>
                    <SupportStatusBadge status={ticket.status} />
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock size={16} className="mr-2" />
                    {format(
                      new Date(ticket.createdAt),
                      "dd MMMM yyyy, hh:mm a",
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[#DC3173] mb-2">
                      <Tag size={18} />
                      <span className="text-sm font-medium uppercase tracking-wide">
                        {removeUnderscore(ticket.category)}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {removeUnderscore(ticket.category)} Inquiry
                    </h2>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <p className="text-gray-600 leading-relaxed italic">
                        &quot;
                        {ticket.lastMessage || "No message content available."}
                        &quot;
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center gap-2 bg-[#DC3173] hover:bg-[#DC3173]/90 font-semibold transition-all hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    View Conversation
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Our team typically responds within{" "}
                  <span className="font-semibold text-gray-700">2-4 hours</span>
                  .
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center rounded-3xl"
            >
              <div className="inline-flex p-6 bg-pink-50 text-[#DC3173] rounded-full mb-6">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Active Support Tickets
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8 px-4">
                You don&lsquo;t have any open requests. If you&lsquo;re
                experiencing an issue, create a ticket and we&lsquo;ll get right
                on it!
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#DC3173] hover:bg-[#DC3173]/90 cursor-pointer"
              >
                Create your first ticket
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateNewTicket onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Right-side Chat Sheet */}
      <AnimatePresence>
        {isOpen && (
          <SupportChatSheet
            ticket={ticket}
            closeChatSheet={() => setIsOpen(false)}
            initialMessagesData={initialMessagesData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
