import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { AuthProvider } from "@/providers/AuthProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stockwise",
  description: "Smart inventory management for Food & Beverage brands.",
};

const theme = createTheme({
  fontFamily: "var(--font-geist-sans), sans-serif",
  headings: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  colors: {
    primary: [
      "#F3E5F5",
      "#E1BEE7",
      "#CE93D8",
      "#BA68C8",
      "#AB47BC",
      "#9C27B0",
      "#8E24AA",
      "#7B1FA2",
      "#6A1B9A",
      "#4A148C",
    ],
  },
  primaryColor: "primary",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <MantineProvider theme={theme}>
            <AuthProvider>{children}</AuthProvider>
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
