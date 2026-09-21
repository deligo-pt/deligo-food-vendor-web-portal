import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TCuisine } from "@/src/types/cuisine.type";
import { Briefcase, Check, X } from "lucide-react";
import { useState } from "react";

interface CuisineMultiSelectProps {
  value: string[];                 // names (or mixed – we handle it)
  onChange: (value: string[]) => void; // ALWAYS sends unique slugs
  cuisines: TCuisine[];
  invalid?: boolean;
  placeholder: string;
  t: (key: string) => string;
  disabled?: boolean;
}

export function CuisineMultiSelect({
  value = [],
  onChange,
  cuisines = [],
  invalid,
  placeholder,
  t,
  disabled,
}: CuisineMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  // ---------- tiny helpers ----------
  const getName = (item: string) =>
    cuisines.find(
      (c) => c.slug === item || c.name.toLowerCase() === item.toLowerCase()
    )?.name ?? item;

  const getSlug = (item: string) =>
    cuisines.find(
      (c) => c.slug === item || c.name.toLowerCase() === item.toLowerCase()
    )?.slug ?? item;

  // unique names from whatever came in (name or slug)
  const selectedNames = [
    ...new Set(value.map(getName).filter(Boolean)),
  ];

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) setTempSelected(selectedNames);
    setOpen(isOpen);
  };

  const handleToggle = (name: string) => {
    // already selected → ignore
    if (selectedNames.some((n) => n.toLowerCase() === name.toLowerCase())) return;

    setTempSelected((prev) => {
      const exists = prev.some((p) => p.toLowerCase() === name.toLowerCase());
      return exists
        ? prev.filter((p) => p.toLowerCase() !== name.toLowerCase())
        : [...prev, name];
    });
  };

  const handleRemove = (name: string) => {
    const remaining = selectedNames.filter(
      (n) => n.toLowerCase() !== name.toLowerCase()
    );
    onChange(remaining.map(getSlug)); // → slugs
  };

  const handleAdd = () => {
    onChange(tempSelected.map(getSlug)); // → slugs
    setOpen(false);
  };

  return (
    <div>
      {/* Badges */}
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-2 border border-dashed rounded-lg bg-gray-50/50">
          {selectedNames.map((name) => (
            <Badge
              key={name}
              variant="secondary"
              className="flex items-center gap-1 bg-[#DC3173]/10 text-[#DC3173] hover:bg-[#DC3173]/20 transition-all capitalize px-3 py-1 text-sm font-medium"
            >
              {name}
              <button
                type="button"
                onClick={() => handleRemove(name)}
                className="rounded-full outline-none hover:bg-[#DC3173]/20 p-0.5"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Briefcase className="absolute left-3 top-3.5 text-[#DC3173]/80" />
        <Select open={open} onOpenChange={handleOpenChange} value="">
          <SelectTrigger
            className={cn(
              "pl-11 pr-4 h-12 w-full bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer",
              invalid
                ? "border-destructive focus-visible:ring-destructive/20"
                : "border-gray-300"
            )}
            style={{ height: "3rem" }}
            disabled={disabled}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent className="p-0">
            <div className="max-h-60 overflow-y-auto py-1">
              {cuisines.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">{t("no_items_found")}</div>
              ) : (
                cuisines.map((type) => {
                  const isSelected = selectedNames.some(
                    (n) => n.toLowerCase() === type.name.toLowerCase()
                  );
                  const isChecked = tempSelected.some(
                    (n) => n.toLowerCase() === type.name.toLowerCase()
                  );

                  return (
                    <div
                      key={type.slug}
                      onClick={() => !isSelected && handleToggle(type.name)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 select-none capitalize",
                        isSelected
                          ? "opacity-50 cursor-not-allowed bg-gray-50"
                          : isChecked
                            ? "bg-[#DC3173]/10 text-[#DC3173] cursor-pointer"
                            : "hover:bg-gray-50 cursor-pointer"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                          isChecked || isSelected
                            ? "border-[#DC3173] bg-[#DC3173] text-white"
                            : "border-gray-300"
                        )}
                      >
                        {(isChecked || isSelected) && (
                          <Check className="h-3 w-3" strokeWidth={3} />
                        )}
                      </div>
                      <span>{type.name}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t p-2 sticky bottom-0 bg-white">
              <Button
                type="button"
                onClick={handleAdd}
                disabled={disabled}
                className="w-full h-10 rounded-lg bg-[#DC3173] hover:bg-[#c21c5e] text-white text-sm font-medium"
              >
                {t("add_selected")} ({tempSelected.length})
              </Button>
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}