"use client";
import { NavLink } from "@mantine/core";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default interface NavLinkProps {
  title: string;
  href: string;
  icon: ReactNode;
}

export function PrimaryNavLink({ title, href, icon }: NavLinkProps) {
  const pathname = usePathname();
  return (
    <NavLink
      className="mt-4 rounded-md group"
      href={href}
      active={pathname === href}
      label={
        <span className="text-white group-hover:text-[var(--primary-4)] transition-colors">
          {title}
        </span>
      }
      color="white"
      leftSection={icon}
    />
  );
}
