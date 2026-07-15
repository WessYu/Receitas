import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ToastProvider } from "@/components/toast";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Savor — Receitas que valem o seu tempo",
    template: "%s | Savor"
  },
  description: "Descubra, salve e cozinhe receitas em português, com favoritos, comentários, modo cozinha e painel administrativo.",
  applicationName: "Savor",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Savor — Receitas que valem o seu tempo",
    description: "Uma plataforma full stack para descobrir, salvar e cozinhar receitas com mais prazer.",
    url: "/",
    siteName: "Savor",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Savor — receitas que valem o seu tempo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Savor — Receitas que valem o seu tempo",
    description: "Descubra, salve e cozinhe receitas em português.",
    images: ["/opengraph-image"]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <ToastProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
