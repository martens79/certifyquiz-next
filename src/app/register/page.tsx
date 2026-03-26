import { Suspense } from "react";
import RegisterPage from "@/app/[lang]/register/page";

export default function RegisterEN() {
  return (
    <Suspense fallback={null}>
      <RegisterPage />
    </Suspense>
  );
}