"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  AppShell,
  Burger,
  Loader,
  Center,
  Accordion,
  NavLink,
} from "@mantine/core";
import { UsersService } from "@/services/Users";
import { useDisclosure } from "@mantine/hooks";
import {
  ArrowLeftStartOnRectangleIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PresentationChartBarIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { PrimaryNavLink } from "@/components";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { token, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { toggle }] = useDisclosure();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [token, loading, router]);

  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const user = await UsersService.getCurrentUser();
          setUserName(user.name);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    }
  }, [token]);

  if (loading || !token)
    return (
      <Center>
        <Loader />
      </Center>
    ); // show loader until token is ready

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header style={{ backgroundColor: "var(--primary-4)" }}>
        <div className="relative flex items-center h-full w-full">
          <Burger
            color="var(--background)"
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="md"
            className="absolute left-0"
          />
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <span className="text-3xl font-bold text-white">Stockwise</span>
          </div>
          <span
            style={{
              position: "fixed",
              top: 5,
              right: 5,
            }}
          >
            <Accordion variant="filled">
              <Accordion.Item value="Hello User">
                <Accordion.Control
                  style={{
                    color: "white",
                    backgroundColor: "var(--primary-4)",
                    transition: "color 0.2s, background 0.2s",
                  }}
                >
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    <span>Hello {userName}</span>
                  </div>
                </Accordion.Control>

                <Accordion.Panel>
                  <button
                    className="cursor-pointer flex items-center"
                    onClick={logout}
                  >
                    <ArrowLeftStartOnRectangleIcon className="w-5 h-5 mr-2" />
                    <span>Logout</span>
                  </button>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </span>
        </div>
      </AppShell.Header>

      <AppShell.Navbar
        style={{ backgroundColor: "var(--primary-8)" }}
        className="px-2"
      >
        <div className="mt-12">
          <PrimaryNavLink
            title="Products"
            href="/dashboard/products"
            icon={
              <CubeIcon className="w-5 h-5 text-white group-hover:text-[var(--primary-4)] transition-colors" />
            }
          />
          <PrimaryNavLink
            title="Stocks"
            href="/dashboard/stocks"
            icon={
              <ClipboardDocumentListIcon className="w-5 h-5 text-white group-hover:text-[var(--primary-4)] transition-colors" />
            }
          />
          <PrimaryNavLink
            title="Purchases"
            href="/dashboard/purchases"
            icon={
              <ShoppingCartIcon className="w-5 h-5 text-white group-hover:text-[var(--primary-4)] transition-colors" />
            }
          />
          <PrimaryNavLink
            title="Sales"
            href="/dashboard/sales"
            icon={
              <CurrencyDollarIcon className="w-5 h-5 text-white group-hover:text-[var(--primary-4)] transition-colors" />
            }
          />
          <PrimaryNavLink
            title="Finances"
            href="/dashboard/finances"
            icon={
              <PresentationChartBarIcon className="w-5 h-5 text-white group-hover:text-[var(--primary-4)] transition-colors" />
            }
          />
        </div>
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: "var(--primary-1)" }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
