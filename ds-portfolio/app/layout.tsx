import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Arkhe",
  description:
    "A portfolio built around one continuous canvas that rotates between a project view and a full index.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
