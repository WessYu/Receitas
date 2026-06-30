import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "Receitas | Cozinha simples e elegante",
  description: "Uma plataforma moderna para descobrir, salvar e administrar receitas."
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
