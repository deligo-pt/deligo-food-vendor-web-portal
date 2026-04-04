import VendorChatSupport from "@/src/components/Dashboard/Support/ChatSupport";
import { TConversation } from "@/src/types/chat.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function ChatSupportPage() {
  const conversationData = {} as TConversation;
  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const decoded = jwtDecode(accessToken) as { userId: string };

  return (
    <VendorChatSupport
      initialConversation={conversationData}
      userId={decoded?.userId}
    />
  );
}
