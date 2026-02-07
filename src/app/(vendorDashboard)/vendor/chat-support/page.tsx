import VendorChatSupport from "@/src/components/Dashboard/Support/ChatSupport";
import {
  getMessagesByRoomReq,
  openConversationReq,
} from "@/src/services/dashboard/chat/chat";
import { TMeta } from "@/src/types";
import { TConversation, TMessage } from "@/src/types/chat.type";

export default async function ChatSupportPage() {
  let conversationData = {} as TConversation;
  const messagesData = {} as { data: TMessage[]; meta?: TMeta };

  const conversationResult = await openConversationReq();

  if (conversationResult.success) {
    conversationData = conversationResult.data;

    const messagesResult = await getMessagesByRoomReq(conversationData.room);

    if (messagesResult.success) {
      messagesData.data = messagesResult.data;
      messagesData.meta = messagesResult.meta;
    }
  }

  return (
    <VendorChatSupport
      initialConversation={conversationData}
      initialMessagesData={messagesData}
    />
  );
}
