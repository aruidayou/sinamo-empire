"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const q = query(collection(db, "accessCodes"), where("code", "==", code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        router.push("/dashboard");
      } else {
        setError("合言葉が違います。入国不許可。");
      }
    } catch (err) {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div style={{ padding: '40px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', width: '100%', maxWidth: '400px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '24px', marginBottom: '10px', letterSpacing: '2px' }}>SINAMO EMPIRE</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>帝国入国ゲート</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="password" 
            placeholder="アクセスコードを入力" 
            value={code} 
            onChange={(e) => setCode(e.target.value)}
            style={{ padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', outline: 'none', textAlign: 'center' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '12px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.2s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "照合中..." : "入国する"}
          </button>
        </form>
        {error && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '20px' }}>{error}</p>}
      </div>
    </div>
  );
}