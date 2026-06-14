import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Application Ready",
  description: "The application scaffold is ready for development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
