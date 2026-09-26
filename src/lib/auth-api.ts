export type AuthResponse = {
  status?: boolean;
  success?: boolean;
  message?: string;
  resetToken?: string;
  data?: { resetToken?: string; message?: string };
};

export async function authRequest<T = AuthResponse>(
  path: string,
  body: object,
  accessToken?: string,
  options?: { method?: "POST" | "PATCH"; headers?: Record<string, string> },
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!baseUrl) throw new Error("Backend API URL is not configured.");
  let response: Response;
  try {
    response = await fetch(
      `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`,
      {
        method: options?.method ?? "POST",
        headers: {
          ...options?.headers,
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.status === false || result?.success === false) {
    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : Array.isArray(result?.message)
          ? result.message.join(". ")
          : "Request failed. Please try again.",
    );
  }
  if (!result || typeof result !== "object")
    throw new Error("Invalid response from the server.");
  if (!result.message && typeof result.data?.message === "string")
    result.message = result.data.message;
  return result as T;
}

export const forgotPassword = (email: string) =>
  authRequest("/auth/forgot-password", { email });
export const verifyCode = (email: string, otp: string) =>
  authRequest("/auth/verify-reset-otp", { email, code: otp });
export const resetPassword = (body: {
  email: string;
  newPassword: string;
  resetToken: string;
}) =>
  authRequest(
    "/auth/reset-password",
    { newPassword: body.newPassword },
    undefined,
    { headers: { "x-password-reset-token": body.resetToken } },
  );

export const changePassword = (
  body: { oldPassword: string; newPassword: string },
  accessToken: string,
) =>
  authRequest(
    "/auth/change-password",
    { currentPassword: body.oldPassword, newPassword: body.newPassword },
    accessToken,
    { method: "PATCH" },
  );
