export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}