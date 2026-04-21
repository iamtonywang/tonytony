import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";
import "./globals.css";

export const metadata: Metadata = {
  title: "TONYWANG | 식물세포 유전자 단백질 BIO 연구소",
  description: "식물세포 유전자 단백질 기반 BIO 연구소",
  openGraph: {
    title: "TONYWANG | 식물세포 유전자 단백질 BIO 연구소",
    description: "식물세포 유전자 단백질 기반 BIO 연구소",
    url: "https://www.iamtonywang.com",
    siteName: "TONYWANG",
    locale: "ko_KR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerSession = await getHeaderSession();

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@2.0/nanumsquare.css"
        />
        <meta name="google-site-verification" content="FKvLF5e5idYyu5isHgBO7ie1PUPm4uGklpLCCpV6z3Q" />
      </head>
      <body>
        <Header
          authenticated={headerSession.authenticated}
          loginId={headerSession.loginId}
          isPartner={headerSession.isPartner}
          isAdmin={headerSession.isAdmin}
        />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
