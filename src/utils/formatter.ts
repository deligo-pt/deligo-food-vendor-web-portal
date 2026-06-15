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

export function queryStringFormatter(searchParamsObj: {
  [key: string]: string | string[] | undefined;
}): string {
  let queryString = "";

  const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
    } else if (value !== undefined) {
      return `${key}=${encodeURIComponent(value)}`;
    }

    return "";
  });

  queryString = queryArray.filter((q) => q !== "").join("&");

  return queryString;
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}