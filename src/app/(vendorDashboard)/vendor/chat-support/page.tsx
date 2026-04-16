import SupportTickets from "@/src/components/Dashboard/Support/SupportTickets/SupportTickets";
import { getMyTicketReq } from "@/src/services/dashboard/support/support.service";

export default async function ChatSupportPage() {
  const ticket = await getMyTicketReq();

  return <SupportTickets ticket={ticket} />;
}
