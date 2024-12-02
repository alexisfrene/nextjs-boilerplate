"use client";
import { Open_Sans, Roboto_Condensed } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { cn } from "@/lib";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "@/components";
import logo from "../../public/favicon.ico";
import "./globals.css";

const mainFont = Open_Sans({ subsets: ["latin"] });
const robotoFont = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href={logo.src} sizes="any" />
        <title>GM E.N.D App</title>
      </head>
      <body
        className={cn(
          "bg-select-title",
          mainFont.className,
          robotoFont.variable
        )}
      >
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
