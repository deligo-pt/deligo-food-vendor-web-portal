"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOS_ISSUE_TAGS } from "@/src/consts/sos.const";
import { triggerSOSReq } from "@/src/services/dashboard/SOS/SOS";
import { createSosValidationSchema } from "@/src/validations/sos/sos.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TSosForm = z.infer<typeof createSosValidationSchema>;
type TSosIssueTag = (typeof SOS_ISSUE_TAGS)[number];

export default function SOSModal({ open, onOpenChange }: IProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<TSosForm>({
    resolver: zodResolver(createSosValidationSchema),
    defaultValues: {
      userNote: "",
      issueTags: [],
    },
  });

  const [watchIssueTags] = useWatch({
    control: form.control,
    name: ["issueTags"],
  });

  const addIssueTag = (tag: TSosIssueTag) => {
    if (tag && !form?.getValues("issueTags")?.includes(tag)) {
      const prevTags = form?.getValues("issueTags") || [];
      const newTags = [...prevTags, tag] as typeof prevTags;
      form.setValue("issueTags", newTags);
    }
  };

  const removeIssueTag = (tagToRemove: string) => {
    const newTags = form
      ?.getValues("issueTags")
      ?.filter((t) => t !== tagToRemove);
    form.setValue("issueTags", newTags);
  };

  const handleSubmit = async (data: TSosForm) => {
    setIsSubmitting(true);

    const toastId = toast.loading("Sending SOS...");

    const result = await triggerSOSReq({
      userNote: data.userNote as string,
      issueTags: data.issueTags as TSosIssueTag[],
    });

    if (result.success) {
      toast.success(result.message || "SOS Sent Successfully!", {
        id: toastId,
      });
      form.reset();
      onOpenChange(false);
      setIsSubmitting(false);
      return;
    }

    toast.error(result.message || "Failed to send SOS", { id: toastId });
    console.log(result);

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="text-[#DC3173]">
            SOS Emergency Alert
          </DialogTitle>
          <DialogHeader>
            <DialogDescription>
              Instantly send an emergency alert with your live location to
              admins and emergency contacts for immediate assistance.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              id="sosForm"
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="userNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What&lsquo;s going wrong?</FormLabel>
                    <FormControl>
                      <Input
                        id="userNote"
                        name="userNote"
                        onBlur={(e) => field.onChange(e.target.value)}
                        placeholder="Describe your issue here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Tags
                </label>
                {watchIssueTags && watchIssueTags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-1">
                    {watchIssueTags?.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeIssueTag(tag)}
                          className="ml-2 text-white hover:text-[#CCC]"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="issueTags"
                  render={() => (
                    <FormItem className="gap-1">
                      <FormControl>
                        <Select
                          onValueChange={(value: TSosIssueTag) => {
                            addIssueTag(value);
                          }}
                        >
                          <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm h-10">
                            <SelectValue placeholder="Add an issue tag" />
                          </SelectTrigger>
                          <SelectContent>
                            {SOS_ISSUE_TAGS.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              form="sosForm"
              type="submit"
              className="bg-[#DC3173] hover:bg-[#DC3173]/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending SOS..." : "Send SOS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
