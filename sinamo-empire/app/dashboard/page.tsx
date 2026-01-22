"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit, Timestamp } from "firebase/firestore";

// メッセージの型定義
interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp | null;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
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
      const msgs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Message));
      setMessages(msgs);
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
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#020617", minHeight: "100vh", color: "#f8fafc", fontFamily: "sans-serif" }}>
      <nav style={{ padding: "15px 25px", background: "#0f172a", borderBottom: "2px solid #38bdf8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.2rem", color: "#38bdf8", fontWeight: "bold" }}>SINAMO EMPIRE</h1>
          <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b" }}>DAY {days}</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <a href="https://battlefy.com/algs" target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", fontSize: "0.7rem", textDecoration: "none", border: "1px solid #38bdf8", padding: "4px 8px", borderRadius: "4px" }}>ALGS</a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f8fafc", fontSize: "0.7rem", textDecoration: "none", border: "1px solid #475569", padding: "4px 8px", borderRadius: "4px" }}>X</a>
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
        <div style={{ background: "#0f172a", borderRadius: "12px", height: "600px", display: "flex", flexDirection: "column", border: "1px solid #1e293b" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            {messages.map((m) => (
              <div key={m.id} style={{ marginBottom: "15px" }}>
                <div style={{ background: "#1e293b", padding: "10px", borderRadius: "8px", border: "1px solid #334155", display: "inline-block" }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
          <form onSubmit={sendMessage} style={{ padding: "20px", borderTop: "1px solid #1e293b", display: "flex", gap: "10px" }}>
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="通信開始..." style={{ flex: 1, padding: "10px", borderRadius: "6px", background: "#020617", color: "white", border: "1px solid #334155" }} />
            <button type="submit" style={{ padding: "10px 20px", background: "#38bdf8", color: "#020617", fontWeight: "bold", borderRadius: "6px", border: "none" }}>送信</button>
          </form>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#0f172a", padding: "15px", borderRadius: "12px", border: "1px solid #38bdf8" }}>
            <h3 style={{ fontSize: "0.8rem", color: "#38bdf8", marginTop: 0 }}>OPERA PINBOARD</h3>
            <a href="https://pinboard.opera.com/view/95a0131b-6083-4905-8cdf-33066a324879" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.7rem", color: "#f8fafc", textDecoration: "underline" }}>ボードを開く</a>
          </div>
        </aside>
      </div>
    </div>
  );
}