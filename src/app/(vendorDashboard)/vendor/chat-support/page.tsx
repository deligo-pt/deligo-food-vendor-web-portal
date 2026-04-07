import SupportTickets from "@/src/components/Dashboard/Support/SupportTickets/SupportTickets";
import {
  getMessagesReq,
  getMyTicketReq,
} from "@/src/services/dashboard/support/support.service";
import { TMeta } from "@/src/types";
import { TSupportMessage } from "@/src/types/support.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function ChatSupportPage() {
  const ticket = await getMyTicketReq();
  let initialMessagesData = { data: [] } as {
    data: TSupportMessage[];
    meta?: TMeta;
  };

  if (ticket.ticketId) {
    initialMessagesData = await getMessagesReq(ticket.ticketId, {
      limit: "50",
    });
  }

  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const { userId, name } = jwtDecode(accessToken) as {
    userId: string;
    name: { firstName: string; lastName: string };
  };

  return (
    <SupportTickets
      ticket={ticket}
      userId={userId}
      userName={`${name.firstName} ${name.lastName}`}
      initialMessagesData={initialMessagesData}
    />
  );
}
