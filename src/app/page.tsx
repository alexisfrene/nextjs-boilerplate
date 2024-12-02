"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSessionStore } from "@/src/global";

export default function Home() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const setToken = useSessionStore((state) => state.setToken);
  const token = useSessionStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
      return;
    }
    const checkSession = async () => {
      if (status === "authenticated") {
        const newToken = await update();

        setToken(newToken?.user.token || "");
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    };

    checkSession();
  }, [token, setToken, router, session, status, update]);

  return <div />;
}
