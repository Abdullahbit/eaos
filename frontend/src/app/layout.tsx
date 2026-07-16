import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Insider | Avoid Costly Mistakes Studying in Turkey",
  description:
    "Get clear, current information on universities, tuition costs, and verified study options in Turkey directly from a Computer Engineering student in Istanbul.",
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
