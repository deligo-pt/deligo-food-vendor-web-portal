"use client";

import CreateNewTicket from "@/src/components/Dashboard/Support/SupportTickets/CreateNewTicket";
import SupportChatSheet from "@/src/components/Dashboard/Support/SupportTickets/SupportChatSheet";
import SupportStatusBadge from "@/src/components/Dashboard/Support/SupportTickets/SupportStatusBadge";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { TMeta } from "@/src/types";
import { TSupportTicket } from "@/src/types/support.type";
import { removeUnderscore, textLimitter } from "@/src/utils/formatter";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

interface IProps {
  ticketsData: { data: TSupportTicket[]; meta?: TMeta };
  userId: string;
  userName: string;
}

export default function SupportTickets({ ticketsData }: IProps) {
  //  const { t } = useTranslation();

  //  const [tickets, setTickets] = useState<TSupportTicket[]>(
  //    ticketsData?.data || [],
  //  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TSupportTicket | null>(
    null,
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <TitleHeader
        title="Support Tickets"
        subtitle="Need help? Open a ticket and our team will assist you"
        buttonInfo={{
          text: "New Ticket",
          onClick: () => setIsModalOpen(true),
        }}
      />

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {ticketsData.data?.map((ticket, index) => (
            <motion.div
              key={ticket._id}
              layout
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                delay: index * 0.05,
              }}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-[#DC3173]/30 transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {ticket.ticketId}
                </span>
                <SupportStatusBadge status={ticket.status} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#DC3173] transition-colors">
                {removeUnderscore(ticket.category)}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                {textLimitter(ticket.lastMessage as string) || "-"}
              </p>

              {/* <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Tag size={12} />
                    {ticket.category}
                  </span>
                </div> */}

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Created: {format(ticket.createdAt, "dd MMMM yyyy; hh:mm a")}
                </span>
                {/* <span>{ticket.messages.length} msgs</span> */}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {ticketsData.meta?.total === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="inline-flex p-4 bg-white rounded-full text-gray-300 mb-3 shadow-sm">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No tickets found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!!ticketsData?.meta?.totalPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 md:px-6"
        >
          <PaginationComponent
            totalPages={ticketsData?.meta?.totalPage as number}
          />
        </motion.div>
      )}

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateNewTicket onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Right-side Chat Sheet */}
      <AnimatePresence>
        {selectedTicket && (
          <SupportChatSheet
            ticket={selectedTicket}
            closeChatSheet={() => setSelectedTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
