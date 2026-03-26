// src/app/forgot-password/page.tsx
import { Suspense } from "react";
import ForgotPasswordPage from "@/app/[lang]/forgot-password/page";

export default function ForgotPasswordEN() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPage />
    </Suspense>
  );
}