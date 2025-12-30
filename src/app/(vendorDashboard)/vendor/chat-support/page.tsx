import { serverRequest } from "@/lib/serverFetch";
import VendorChatSupport from "@/src/components/Dashboard/Support/ChatSupport";
import { TMeta, TResponse } from "@/src/types";
import { TConversation, TMessage } from "@/src/types/chat.type";
import { TVendor } from "@/src/types/vendor.type";

export default async function ChatSupportPage() {
  let conversationData = {} as TConversation;
  let messagesData = {} as { data: TMessage[]; meta?: TMeta };

  try {
    const profileResult = (await serverRequest.get(
      "/profile"
    )) as TResponse<TVendor>;

    const conversationResult = (await serverRequest.post(
      "/support/conversation",
      {
        data: {
          type: "SUPPORT",
          targetUser: {
            userId: profileResult?.data?.userId,
            role: profileResult?.data?.role,
            name: `${profileResult?.data?.name?.firstName} ${profileResult?.data?.name?.lastName}`,
          },
        },
      }
    )) as TResponse<TConversation>;

    conversationData = conversationResult.data;

    const messagesResult = (await serverRequest.get(
      `/support/conversations/${conversationResult?.data?.room}/messages`,
      { params: { page: 1, limit: 50, sortBy: "createdAt" } }
    )) as TResponse<TMessage[]>;

    messagesData = messagesResult;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error?.response?.data, error.message);
  }

  return (
    <VendorChatSupport
      initialConversation={conversationData}
      initialMessagesData={messagesData}
    />
  );
}
