import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext';
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation"; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Université Numérique du Sénégal (UNS)",
  description: "Plateforme éducative de l'Université Numérique du Sénégal",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <AuthProvider>
           <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}