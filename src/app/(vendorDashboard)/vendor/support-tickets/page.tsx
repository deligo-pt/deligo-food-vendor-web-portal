import SupportTickets from "@/src/components/Dashboard/Support/SupportTickets/SupportTickets";
import { getAllTicketsReq } from "@/src/services/dashboard/support/support.service";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface IProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ChatSupportPage({ searchParams }: IProps) {
  const queries = await searchParams;
  const ticketsData = await getAllTicketsReq(queries);

  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const { userId, name } = jwtDecode(accessToken) as {
    userId: string;
    name: { firstName: string; lastName: string };
  };

  return (
    <SupportTickets
      ticketsData={ticketsData}
      userId={userId}
      userName={`${name.firstName} ${name.lastName}`}
    />
  );
}
