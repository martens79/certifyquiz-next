// src/app/[lang]/register/page.tsx
import { Suspense } from "react";
import RegisterPageClient from "./register-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-600 text-white text-lg">
          ⏳ ...
        </div>
      }
    >
      <RegisterPageClient />
    </Suspense>
  );
}
