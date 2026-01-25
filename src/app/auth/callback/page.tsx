// src/app/auth/callback/page.tsx
import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md p-6 text-center text-sm text-gray-600">
          Sto completando il login…
        </div>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}
