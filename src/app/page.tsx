// app/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/it"); // oppure "/en", o logica per auto-rilevare la lingua
}
