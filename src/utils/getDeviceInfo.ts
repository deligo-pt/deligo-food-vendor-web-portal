import { cookies } from "next/headers";
import { UAParser } from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";

export const getDeviceInfo = async () => {
  const parser = new UAParser();
  const result = parser.getResult();

  const cookieStore = await cookies();

  let deviceId = cookieStore.get("deligo-food-vendor-deviceId")?.value || "";

  if (!deviceId) {
    deviceId = uuidv4();
    cookieStore.set("deligo-food-vendor-deviceId", deviceId);
  }

  return {
    deviceId,
    deviceType: "browser",
    deviceName: `${result.browser.name} ${result.browser.version}`,
    userAgent: navigator.userAgent,
  };
};
