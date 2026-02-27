"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider"; // <-- se il path è diverso, adattalo

export default function PremiumSuccessPage() {
  const { refreshMe } = useAuth();
  const [sync, setSync] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    (async () => {
      try {
        setSync("idle");
        await refreshMe(); // ✅ ricalcola user.premium subito
        setSync("ok");
      } catch {
        setSync("fail");
      }
    })();
  }, [refreshMe]);

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Premium activated 🎉</h1>
      <p className="mb-4 text-lg">Your 7-day free trial has started.</p>
      <p className="mb-6 text-gray-600">
        You now have full access to explanations and Premium features.
      </p>

      <p className="mb-10 text-sm text-gray-500">
        {sync === "idle" && "Syncing your Premium status..."}
        {sync === "ok" && "Premium status synced ✅"}
        {sync === "fail" && "Could not sync automatically. Try reloading the page."}
      </p>

      <div className="flex flex-col gap-4">
        <Link href="/quiz-home" className="bg-black text-white px-6 py-3 rounded-lg">
          Go to quizzes
        </Link>
        <Link href="/" className="border px-6 py-3 rounded-lg">
          Back to home
        </Link>
      </div>
    </div>
  );
}