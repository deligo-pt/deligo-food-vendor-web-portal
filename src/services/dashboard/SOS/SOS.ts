"use server";

import { serverRequest } from "@/lib/serverFetch";
import { SOS_ISSUE_TAGS } from "@/src/consts/sos.const";
import { catchAsync } from "@/src/utils/catchAsync";

type TSosIssueTag = (typeof SOS_ISSUE_TAGS)[number];

export const triggerSOSReq = async (data: {
  userNote: string;
  issueTags: TSosIssueTag[];
}) => {
  return catchAsync<null>(async () => {
    return await serverRequest.post("/sos/trigger", {
      data,
    });
  });
};
