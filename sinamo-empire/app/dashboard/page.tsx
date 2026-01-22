"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from "firebase/firestore";

export default function Dashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [days, setDays] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundingDate = new Date("2026-01-21");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - foundingDate.getTime());
    setDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender: "帝国市民",
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <div style={{ backgroundColor: "#020617", minHeight: "100vh", color: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      {/* ヘッダー */}
      <nav style={{ padding: "15px 25px", background: "#0f172a", borderBottom: "2px solid #38bdf8", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", color: "#38bdf8", fontWeight: "900", letterSpacing: "2px" }}>SINAMO EMPIRE CENTRAL</h1>
          <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b" }}>FOUNDED: 2026-01-21 | DAY {days}</p>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <a href="https://battlefy.com/algs" target="_blank" style={{ color: "#38bdf8", fontSize: "0.8rem", textDecoration: "none", border: "1px solid #38bdf8", padding: "5px 10px", borderRadius: "4px" }}>ALGS INFO</a>
          <a href="https://x.com" target="_blank" style={{ color: "#f8fafc", fontSize: "0.8rem", textDecoration: "none", border: "1px solid #475569", padding: "5px 10px", borderRadius: "4px" }}>X / TWITTER</a>
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
        
        {/* メイン：チャットエリア */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#0f172a", borderRadius: "12px", height: "600px", display: "flex", flexDirection: "column", border: "1px solid #1e293b", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.map((m) => (
                <div key={m.id} style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                  <div style={{ background: "#1e293b", padding: "10px 15px", borderRadius: "0 12px 12px 12px", border: "1px solid #334155" }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: "0.6rem", color: "#475569", marginTop: "4px", display: "block" }}>{m.sender} - SYSTEM_LOG</span>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: "20px", borderTop: "1px solid #1e293b", display: "flex", gap: "10px" }}>
              <input 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="帝国通信回線へメッセージを入力..."
                style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#020617", color: "white", outline: "none" }}
              />
              <button type="submit" style={{ padding: "12px 24px", background: "#38bdf8", color: "#020617", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>送信</button>
            </form>
          </div>
        </div>

        {/* サイドバー：重要リンク集 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#0f172a", padding: "20px", borderRadius: "12px", border: "1px solid #38bdf8" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "0.9rem", color: "#38bdf8" }}>🏁 ALGS PORTAL</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><a href="https://battlefy.com/algs" target="_blank" style={{ color: "#f8fafc", fontSize: "0.85rem", textDecoration: "none" }}>・Battlefy (公式トーナメント)</a></li>
              <li><a href="https://liquipedia.net/apexlegends/Main_Page" target="_blank" style={{ color: "#f8fafc", fontSize: "0.85rem", textDecoration: "none" }}>・Liquipedia (詳細データ)</a></li>
            </ul>
          </div>

          <div style={{ background: "#0f172a", padding: "20px", borderRadius: "12px", border: "1px solid #10b981" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "0.9rem", color: "#10b981" }}>📌 OPERA PINBOARD</h3>
            <a href="https://pinboard.opera.com/view/95a0131b-6083-4905-8cdf-33066a324879" target="_blank" style={{ 
              display: "block", 
              padding: "10px", 
              background: "#020617", 
              color: "#10b981", 
              borderRadius: "6px", 
              fontSize: "0.75rem", 
              textDecoration: "none",
              border: "1px solid #10b981",
              textAlign: "center"
            }}>
              ピンボードを閲覧する
            </a>
          </div>

          <div style={{ background: "#1e293b", padding: "15px", borderRadius: "12px", fontSize: "0.8rem", color: "#94a3b8" }}>
            <p style={{ margin: 0 }}>※ログアウト機能は撤廃されました。セッションは帝国によって永続的に維持されます。</p>
          </div>
        </div>
      </div>
    </div>
  );
}