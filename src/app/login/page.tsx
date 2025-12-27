import { Suspense } from "react";
import LoginClient from "@/app/[lang]/login/login-client";

export default function LoginEN() {
  return (
    <Suspense fallback={null}>
      <LoginClient initialLang="en" />
    </Suspense>
  );
}
