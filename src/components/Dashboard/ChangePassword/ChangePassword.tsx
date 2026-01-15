"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import { changePasswordReq } from "@/src/services/dashboard/changePassword/changePassword";
import { removeCookie } from "@/src/utils/cookies";
import { changePasswordValidation } from "@/src/validations/auth/change-password.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0px 8px 24px rgba(0,0,0,0.06)";

type ChangePasswordData = z.infer<typeof changePasswordValidation>;

export default function ChangePassword() {
  const { t } = useTranslation();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordValidation),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: ChangePasswordData) => {
    const toastId = toast.loading("Updating Password...");

    const changePasswordData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };

    const result = await changePasswordReq(changePasswordData);

    if (result.success) {
      toast.success("Password Updated Successfully!", { id: toastId });

      setSuccess(true);
      removeCookie("accessToken");
      removeCookie("refreshToken");

      setTimeout(() => {
        router.push("/login");
      }, 500);

      return;
    }

    toast.error(result.message || "Password Update Failed", { id: toastId });
    console.log(result);
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[600px] mx-auto space-y-10"
        >
          {/* HEADER */}
          <div className="flex items-center gap-3">
            <Lock size={40} className="text-pink-600" />
            <div>
              <h1
                className="text-4xl font-extrabold"
                style={{ color: PRIMARY }}
              >
                {t("change_password")}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                {t("update_account_password_securely")}
              </p>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <CheckCircle /> {t("password_updated_successfully")}
            </div>
          )}

          {/* FORM */}
          <Card
            className="rounded-3xl bg-white border shadow-md"
            style={{ boxShadow: SHADOW }}
          >
            <CardContent className="p-6 space-y-6">
              {/* OLD PASSWORD */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">
                      {t("current_password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOld ? "text" : "password"}
                          placeholder={t("enter_current_password")}
                          className={cn(
                            "h-12 rounded-xl pr-10",
                            fieldState.invalid ? "border-destructive" : ""
                          )}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-500"
                          onClick={() => setShowOld(!showOld)}
                        >
                          {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NEW PASSWORD */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">
                      {t("new_password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder={t("enter_new_password")}
                          className={cn(
                            "h-12 rounded-xl pr-10",
                            fieldState.invalid ? "border-destructive" : ""
                          )}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-500"
                          onClick={() => setShowNew(!showNew)}
                        >
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CONFIRM PASSWORD */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">
                      {t("confirm_password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder={t("re_enter_new_password")}
                          className={cn(
                            "h-12 rounded-xl pr-10",
                            fieldState.invalid ? "border-destructive" : ""
                          )}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-500"
                          onClick={() => setShowConfirm(!showConfirm)}
                        >
                          {showConfirm ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* BUTTON */}
              <div className="flex justify-end">
                <Button
                  className="h-12 px-6 text-white rounded-xl"
                  style={{ background: PRIMARY }}
                  // onClick={updatePassword}
                >
                  {t("update_password")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
