"use client";

import { getUserId } from "@/src/lib/jwt";
import axios from "axios";

export const getUserById = async (token: string) => {
  try {
    const userId = await getUserId(token);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res?.data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
