import { SolanaWalletProvider } from "@/components/wallet-adapter/wallet-adapter";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KitePay | Global Crypto Payroll",
  description: "Hackathon demo for global stablecoin payroll and local currency payouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
