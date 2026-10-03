import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James Cahours | Developer, Maker, Tinkerer",
  description:
    "The personal site of James Cahours — software developer, guitar player, home-project builder, and perpetual tinkerer in Austin, Texas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
