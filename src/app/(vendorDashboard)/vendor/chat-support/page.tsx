import VendorChatSupport from "@/src/components/Dashboard/Support/ChatSupport";
import { TConversation } from "@/src/types/chat.type";

export default async function ChatSupportPage() {
  const conversationData = {} as TConversation;

  return <VendorChatSupport initialConversation={conversationData} />;
}
