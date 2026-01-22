"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query(collection(db, "accessCodes"), where("code", "==", code));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      router.push("/dashboard");
    } else {
      setError("コードが正しくありません。");
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'radial-gradient(circle, #1e293b 0%, #0f172a 100%)' }}>
      <div style={{ padding: '40px', background: '#1e293b', borderRadius: '12px', border: '1px solid #38bdf8', textAlign: 'center', boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)' }}>
        <h1 style={{ color: '#38bdf8', letterSpacing: '4px' }}>SINAMO EMPIRE</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ENTER ACCESS CODE" style={{ padding: '12px', background: '#0f172a', border: '1px solid #475569', color: 'white', textAlign: 'center', borderRadius: '4px' }} />
          <button type="submit" style={{ padding: '12px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>LOGIN</button>
        </form>
        {error && <p style={{ color: '#ef4444', marginTop: '15px' }}>{error}</p>}
      </div>
    </div>
  );
}