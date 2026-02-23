import { api } from "@/lib/axios";
type LoginPayload = {
  email: string;
  password: string;
};
export const loginUser = async (data: LoginPayload) => {
  const response = await api.post("/auth/login", data);

      const { accessToken } = response?.data?.token;

  if (!accessToken) {
    throw new Error("No access token received");
  }
  const userRes = await api.get("/auth/self", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return { user: userRes?.data.user, accessToken };
};