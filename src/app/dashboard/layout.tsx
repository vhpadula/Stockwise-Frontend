"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { AppShell, Burger, Loader, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [token, loading, router]);

  if (loading || !token) return <div>Loading...</div>; // show loader until token is ready

  return (
    <div>
      <span>Dashboard Layout</span>
      {children}
    </div>
  );
}
