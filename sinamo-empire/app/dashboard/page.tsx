"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [days, setDays] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // 建国日（2026/01/21）からの日数を計算
    const foundingDate = new Date("2026-01-21");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - foundingDate.getTime());
    setDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, []);

  useEffect(() => {
    // チャットのリアルタイム受信
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
    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        sender: "帝国市民",
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error(error);
      alert("送信失敗：権限を確認してください");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f172a" }}>
      {/* ナビゲーション */}
      <nav style={{ padding: "15px 20px", background: "rgba(30, 41, 59, 0.95)", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.2rem", color: "#38bdf8", fontWeight: "800", letterSpacing: "1px" }}>SINAMO EMPIRE</h1>
          <span style={{ fontSize: "0.7rem", color: "#94a3b8", letterSpacing: "0.5px" }}>EST. 2026 - DAY {days}</span>
        </div>
        <button onClick={() => router.push("/")} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", transition: "all 0.2s" }}>
          LOGOUT
        </button>
      </nav>

      <div style={{ flex: 1, maxWidth: "800px", margin: "0 auto", width: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
        
        {/* ステータスパネル */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          <div style={{ background: "#1e293b", padding: "15px", borderRadius: "8px", border: "1px solid #334155" }}>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b" }}>SYSTEM STATUS</p>
            <p style={{ margin: "5px 0 0", fontSize: "1rem", fontWeight: "bold", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", boxShadow: "0 0 8px #10b981" }}></span> ONLINE
            </p>
          </div>
          <div style={{ background: "#1e293b", padding: "15px", borderRadius: "8px", border: "1px solid #334155" }}>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b" }}>TOTAL MESSAGES</p>
            <p style={{ margin: "5px 0 0", fontSize: "1rem", fontWeight: "bold", color: "#f8fafc" }}>{messages.length}</p>
          </div>
        </div>

        {/* チャットエリア */}
        <div style={{ flex: 1, background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.length === 0 && <p style={{textAlign: "center", color: "#475569", marginTop: "20px", fontSize: "0.9rem"}}>No communications yet.</p>}
            {messages.map((m) => (
              <div key={m.id} style={{ alignSelf: m.sender === "Admin" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <span style={{ fontSize: "0.6rem", color: "#64748b", marginLeft: "2px", marginBottom: "2px", display: "block" }}>{m.sender}</span>
                <div style={{ 
                  background: m.sender === "Admin" ? "#0ea5e9" : "#334155", 
                  color: "#f8fafc",
                  padding: "10px 14px", 
                  borderRadius: "8px", 
                  borderTopLeftRadius: m.sender === "Admin" ? "8px" : "2px",
                  borderTopRightRadius: m.sender === "Admin" ? "2px" : "8px",
                  lineHeight: "1.5",
                  fontSize: "0.95rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* 入力フォーム */}
          <form onSubmit={sendMessage} style={{ padding: "15px", background: "#0f172a", borderTop: "1px solid #334155", display: "flex", gap: "10px" }}>
            <input 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type command..."
              style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #334155", background: "#1e293b", color: "white", outline: "none", fontSize: "16px" }}
            />
            <button type="submit" style={{ padding: "0 20px", background: "#38bdf8", color: "#0f172a", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "opacity 0.2s" }}>
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}