import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// NEW FONT SYSTEM — Space Grotesk (headlines) + Inter (body)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const midtransEnv = process.env.NEXT_PUBLIC_MIDTRANS_ENV || "sandbox";
const snapScriptUrl =
  midtransEnv === "production"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("antialiased", spaceGrotesk.variable, inter.variable)}
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
