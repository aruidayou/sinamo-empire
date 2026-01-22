"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!code) return;
    const docRef = doc(db, "access_codes", code);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      localStorage.setItem("user_code", code);
      localStorage.setItem("user_name", docSnap.data().name);
      router.push("/dashboard");
    } else {
      alert("アクセスコードが正しくありません");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-black mb-8 text-indigo-400">シナモ帝国 入国審査</h1>
      <input
        type="text"
        className="w-full max-w-xs p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 outline-none text-center text-xl mb-4"
        placeholder="アクセスコード"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full max-w-xs p-4 rounded-2xl bg-indigo-600 font-bold hover:bg-indigo-700 transition-all"
      >
        入国する
      </button>
    </div>
  );
}