// export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import LiveChat from "@/src/components/Dashboard/Support/LiveChat";
import { TMeta, TResponse } from "@/src/types";
import { TConversation, TMessage } from "@/src/types/chat.type";

export default async function LiveChatPage() {
  let conversationData = {} as TConversation;
  let messagesData = {} as { data: TMessage[]; meta?: TMeta };

  try {
    const conversationResult = (await serverRequest.get(
      "/support/conversations"
    )) as TResponse<TConversation[]>;

    console.log(conversationResult);

    conversationData = conversationResult.data?.[0];

    const messagesResult = (await serverRequest.get(
      `/support/conversations/${conversationResult?.data?.[0]?.room}/messages`,
      { params: { page: 1, limit: 50, sortBy: "createdAt" } }
    )) as TResponse<TMessage[]>;

    messagesData = messagesResult;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error?.response?.data, error.message);
  }

  return (
    <LiveChat
      initialConversation={conversationData}
      initialMessagesData={messagesData}
    />
  );
}
