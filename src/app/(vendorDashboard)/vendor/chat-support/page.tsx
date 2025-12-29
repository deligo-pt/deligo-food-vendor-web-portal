import { serverRequest } from "@/lib/serverFetch";
import VendorChatSupport from "@/src/components/Dashboard/Support/ChatSupport";
import { TConversation, TMessage } from "@/src/types/chat.type";

export default async function ChatSupportPage() {
  const conversation: TConversation[] = await serverRequest.get(
    "/support/conversations"
  );

  const messages: TMessage[] = await serverRequest.get(
    `/support/conversations/${conversation?.[0]?.room}/messages`
  );

  return (
    <VendorChatSupport
      initialConversation={conversation?.[0]}
      initialMessages={messages}
    />
  );
}
