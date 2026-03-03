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
      "var(--primary-0)",
      "var(--primary-1)",
      "var(--primary-2)",
      "var(--primary-3)",
      "var(--primary-4)",
      "var(--primary-5)",
      "var(--primary-6)",
      "var(--primary-7)",
      "var(--primary-8)",
      "var(--primary-9)",
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
