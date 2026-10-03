import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James Cahours | Software Developer",
  description: "Portfolio of James Cahours, a software developer specializing in .NET, React, Angular, and cloud applications.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
