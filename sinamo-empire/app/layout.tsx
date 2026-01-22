import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "シナモ帝国",
  description: "帝国臣民のための極秘ネットワーク",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}