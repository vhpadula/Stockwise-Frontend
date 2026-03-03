import api from "@/lib/api";

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const UsersService = {
  async registerUser(data: RegisterUserData) {
    const res = await api.post("/api/users/register/", data);
    return res.data;
  },

  async getCurrentUser(token: string) {
    const res = await api.get("/api/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data as User;
  },
};
