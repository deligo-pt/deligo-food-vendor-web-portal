import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { useTranslation } from "@/src/hooks/use-translation";
import { generateProductDescriptionReq } from "@/src/services/dashboard/products/products";
import { TBusinessCategory } from "@/src/types/category.type";
import { removeUnderscore } from "@/src/utils/formatter";
import { descriptionGeneratorValidation } from "@/src/validations/product/description-generator.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type TDescriptionGeneratorForm = z.infer<typeof descriptionGeneratorValidation>;

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productCategories: TBusinessCategory[];
  onGenerate: (generatedText: string) => void;
  prevValues: {
    productName?: string;
    productCategory?: string;
    productImageUrl?: string;
  };
}

const languages = ["Portuguese", "English"];

export default function DescriptionGeneratorDialog({
  open,
  onOpenChange,
  productCategories,
  onGenerate,
  prevValues,
}: IProps) {
  const { t } = useTranslation();
  const form = useForm<TDescriptionGeneratorForm>({
    resolver: zodResolver(descriptionGeneratorValidation),
    defaultValues: {
      productName: prevValues.productName || "",
      productCategory: prevValues.productCategory || "",
      productImageUrl: prevValues.productImageUrl || "",
      language: "Portuguese",
    },
  });

  const onSubmit = async (data: TDescriptionGeneratorForm) => {
    const toastId = toast.loading(t("Generating description..."));

    const result = await generateProductDescriptionReq(data);

    if (result.success) {
      toast.success(result.message || "Description generated successfully!", {
        id: toastId,
      });
      onGenerate(result.data?.description || "");
      onOpenChange(false);
      form.reset();
      return;
    }

    toast.error(result.message || "Failed to generate description", {
      id: toastId,
    });
    console.log(result);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="w-full! sm:max-w-3xl overflow-y-auto max-h-11/12 p-0!">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#Dc3173]">
                  {t("generated_product_description")}
                </h2>
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("product_name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("product_name_placeholder")}
                          value={field.value}
                          onChange={() => {}}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("product_category")}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={() => {}}
                          defaultValue={field.value}
                          disabled
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("select_category_placeholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category.name}
                              >
                                {removeUnderscore(category.name)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("product_image")}</FormLabel>
                      <FormControl>
                        <Image
                          src={field.value}
                          alt={"Image Preview"}
                          className="w-full h-full max-h-64! object-cover rounded-lg"
                          width={500}
                          height={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("footerLanguage")}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("select_language_placeholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {t(lang.toLowerCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4 py-4">
                  <Button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#DC3173] hover:bg-[#DC3173]/90 transition-colors cursor-pointer"
                  >
                    {t("generate")}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
