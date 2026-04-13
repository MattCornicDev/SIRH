import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO SEO Changes here
export const metadata: Metadata = {
  title: "TeamFlow - SaaS RH",
  description: "Gérez vos équipes simplement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // <-- LE BOUCLIER ANTI-EXTENSION ICI
    >
      <body 
        className="min-h-full flex flex-col"
        suppressHydrationWarning // <-- ET ICI
      >
        {children}
      </body>
    </html>
  );
}