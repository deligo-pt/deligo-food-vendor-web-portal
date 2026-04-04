export function removeUnderscore(text: string): string {
  return (
    text
      ?.split("_")
      ?.map((w) => w.charAt(0).toUpperCase() + w.slice(1)?.toLowerCase())
      ?.join(" ") ?? ""
  );
}

export function textLimitter(text: string, limit = 300): string {
  return text?.length > limit ? text?.slice(0, limit) + "..." : text;
}
