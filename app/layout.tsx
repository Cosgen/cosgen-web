import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const midtransEnv = process.env.NEXT_PUBLIC_MIDTRANS_ENV || "sandbox";
const snapScriptUrl =
  midtransEnv === "production"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", geist.variable, geistMono.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        {clientKey && (
          <Script
            src={snapScriptUrl}
            data-client-key={clientKey}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
