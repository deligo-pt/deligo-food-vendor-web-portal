"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { USER_STATUS } from "@/src/consts/user.const";
import { useTranslation } from "@/src/hooks/use-translation";
import { TResponse } from "@/src/types";
import { TVendor } from "@/src/types/vendor.type";
import { getCookie, removeCookie } from "@/src/utils/cookies";
import { fetchData } from "@/src/utils/requests";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  Award,
  Ban,
  CheckCircle2,
  CircleX,
  Clock,
  LoaderCircle,
  LoaderIcon,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegistrationStatusPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [decodedStatus, setDecodedStatus] = useState("");

  const logOut = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");
    router.push("/login");
  };

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      const decoded = jwtDecode(accessToken || "") as {
        email: string;
        id: string;
        status: string;
      };
      if (decoded?.email) {
        setDecodedStatus(decoded.status);
        const fetchUserData = async (id: string, token: string) => {
          try {
            const result = (await fetchData(`/vendors/${id}`, {
              headers: {
                authorization: token,
              },
            })) as unknown as TResponse<TVendor>;

            if (result.success) {
              setRemarks(result.data.remarks || "");
              setStatus(result.data.status);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error?.response) logOut();
            console.log(error);
          }
        };
        fetchUserData(decoded.id, accessToken);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-pink-50 to-[#DC3173]/10 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="rounded-3xl shadow-2xl border border-[#DC3173]/20 overflow-hidden backdrop-blur-sm bg-white/90">
          <CardHeader className="bg-linear-to-r from-[#DC3173] to-pink-600 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3">
                {status === USER_STATUS.PENDING && (
                  <LoaderIcon className="w-7 h-7 text-white" />
                )}
                {status === USER_STATUS.SUBMITTED && (
                  <CheckCircle2 className="w-7 h-7 text-white" />
                )}
                {status === USER_STATUS.APPROVED && (
                  <Award className="w-7 h-7 text-white" />
                )}
                {status === USER_STATUS.REJECTED && (
                  <CircleX className="w-7 h-7 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold tracking-wide">
                {status === USER_STATUS.PENDING && "Registration Pending"}
                {status === USER_STATUS.SUBMITTED && "Registration Completed"}
                {status === USER_STATUS.APPROVED && "Registration Approved"}
                {status === USER_STATUS.REJECTED && "Registration Rejected"}
              </CardTitle>
            </div>
            <p className="mt-2 text-sm text-white/90 max-w-xl">
              {status === USER_STATUS.PENDING &&
                "You did not submit your registration details. Please try again."}
              {status === USER_STATUS.SUBMITTED &&
                "Congratulations! You’ve successfully submitted your registration details."}
              {status === USER_STATUS.APPROVED &&
                "Congratulations! Your registration has been approved. You can now visit your dashboard."}
              {status === USER_STATUS.REJECTED &&
                "Sorry! Your registration has been rejected."}
            </p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {status === USER_STATUS.PENDING && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
              >
                <div className="rounded-full bg-[#DC3173]/10 p-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <LoaderCircle className="w-10 h-10 text-[#DC3173]" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("submissionInProgress")}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {t("submissionProgressDesc")}
                  </p>
                </div>
              </motion.div>
            )}
            {status === USER_STATUS.SUBMITTED && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                >
                  <div className="rounded-full bg-[#DC3173]/10 p-4">
                    <Clock className="w-10 h-10 text-[#DC3173]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("reviewInProgress")}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {t("reviewInProgressDesc")}{" "}
                      <span className="font-medium text-[#DC3173]">
                        {t("hours24_48")}
                      </span>{" "}
                      {t("reviewInProgressDesc2")}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                >
                  <div className="rounded-full bg-green-100 p-4">
                    <ShieldCheck className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("nextStep")}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {t("nextStepDesc")}{" "}
                      <span className="font-semibold text-green-600">
                        {t("verifiedPartner")}
                      </span>{" "}
                      {t("nextStepDesc2")}
                    </p>
                  </div>
                </motion.div>
              </>
            )}
            {status === USER_STATUS.APPROVED && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
              >
                <div className="rounded-full bg-[#DC3173]/10 p-4">
                  <ShieldCheck className="w-10 h-10 text-[#DC3173]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("approvedByAdmin")}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {remarks}
                  </p>
                </div>
              </motion.div>
            )}
            {status === USER_STATUS.REJECTED && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
              >
                <div className="rounded-full bg-[#DC3173]/10 p-4">
                  <Ban className="w-10 h-10 text-[#DC3173]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("rejectedByAdmin")}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {remarks}
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-6 text-center"
            >
              {status === USER_STATUS.PENDING && (
                <>
                  <Button
                    className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                    onClick={() =>
                      router.push("/become-vendor/personal-details")
                    }
                  >
                    {t("submitDetails")}
                  </Button>
                  <Button
                    variant="outline"
                    className="px-8 py-3 border-destructive text-destructive hover:text-white hover:bg-destructive rounded-xl text-lg font-medium shadow-lg transition-all duration-300 ml-2"
                    onClick={logOut}
                  >
                    {t("logout")}
                  </Button>

                  <p className="text-xs text-gray-500 mt-3">
                    {t("applicationStatus")}
                  </p>
                </>
              )}
              {status === USER_STATUS.SUBMITTED && (
                <>
                  <Button
                    className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                    onClick={() => router.push("/")}
                  >
                    {t("goToHome")}
                  </Button>
                  <Button
                    variant="outline"
                    className="px-8 py-3 border-destructive text-destructive hover:text-white hover:bg-destructive rounded-xl text-lg font-medium shadow-lg transition-all duration-300 ml-2"
                    onClick={logOut}
                  >
                    {t("logout")}
                  </Button>

                  <p className="text-xs text-gray-500 mt-3">
                    {t("applicationApproved")}
                  </p>
                </>
              )}
              {status === USER_STATUS.APPROVED && (
                <>
                  <Button
                    className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                    onClick={() =>
                      decodedStatus === status
                        ? router.push("/become-vendor/personal-details")
                        : logOut()
                    }
                  >
                    {t("loginAgain")}
                  </Button>

                  <p className="text-xs text-gray-500 mt-3">
                    {t("loginAgainDesc")}
                  </p>
                </>
              )}
              {status === USER_STATUS.REJECTED && (
                <>
                  <Button
                    className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                    onClick={() =>
                      decodedStatus === status
                        ? router.push("/become-vendor/personal-details")
                        : logOut()
                    }
                  >
                    {t("submitDetailsAgain")}
                  </Button>

                  <p className="text-xs text-gray-500 mt-3">
                    {t("applicationTryAgain")}
                  </p>
                </>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
