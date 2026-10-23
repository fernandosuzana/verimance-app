import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getDict } from "@/lib/lang";

export const metadata: Metadata = {
  title: "Verimance · Dating for 45+ protected by Guardian AI",
  description: "Verimance is the dating app for people 45+ where every member is verified and Guardian AI spots romance-scam patterns inside the conversation.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, d } = await getDict();
  return (
    <html lang={lang === "pt" ? "pt-BR" : lang === "fr" ? "fr-CA" : "en"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,400&family=Atkinson+Hyperlegible:wght@400;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main className="wrap">{children}</main>
        <footer className="site"><div className="wrap"><p>{d.helpLine}</p><p style={{ marginTop: 6 }}>© {new Date().getFullYear()} Preemptor AI Inc. · Toronto &amp; Oshawa, ON</p></div></footer>
      </body>
    </html>
  );
}
