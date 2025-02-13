import type { Metadata } from "next";
import { Nunito_Sans, Space_Grotesk, Permanent_Marker } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wEngineering",
  description: "Collection of Mechatronics engineering projects created by Braeden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-nunito ${nunitoSans.variable} ${spaceGrotesk.variable} ${permanentMarker.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
