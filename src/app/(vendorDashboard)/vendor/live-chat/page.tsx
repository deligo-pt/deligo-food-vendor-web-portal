// export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import LiveChat from "@/src/components/Dashboard/Support/LiveChat";
import { TMeta, TResponse } from "@/src/types";
import { TConversation, TMessage } from "@/src/types/chat.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function LiveChatPage() {
  let conversationData = {} as TConversation;
  let messagesData = { data: [] } as { data: TMessage[]; meta?: TMeta };

  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const decoded = jwtDecode(accessToken) as { userId: string };

  try {
    const conversationResult = (await serverRequest.get(
      "/support/conversations",
      { params: { type: "VENDOR_CHAT" } }
    )) as TResponse<TConversation[]>;

    conversationData = conversationResult.data?.[0];

    if (conversationData) {
      const messagesResult = (await serverRequest.get(
        `/support/conversations/${conversationResult?.data?.[0]?.room}/messages`,
        { params: { page: 1, limit: 50, sortBy: "createdAt" } }
      )) as TResponse<TMessage[]>;

      messagesData = messagesResult;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error?.response?.data, error.message);
  }

  return (
    <LiveChat
      initialConversation={conversationData}
      initialMessagesData={messagesData}
      vendorId={decoded.userId}
    />
  );
}
