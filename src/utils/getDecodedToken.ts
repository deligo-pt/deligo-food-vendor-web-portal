import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { TJwtPayload } from "../types";

export async function getDecodedToken() {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) return null;

    try {
        return jwtDecode<TJwtPayload>(token);
    } catch {
        return null;
    }
}