import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alexx | Roblox UI Designer",
  description: "Professional UI/UX Designer for Roblox. Commission me for high-quality interfaces.",
  icons: {
    icon: '/assets/PFP.png', // Uses your PFP as the browser tab icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}