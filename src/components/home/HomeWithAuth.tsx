"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getToken } from "@/lib/auth";
import Home from "./Home";

type Props = {
  lang: Locale;
};

export default function HomeWithAuth({ lang }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // legge il token salvato (stessa logica che usi per header/profile)
    setIsLoggedIn(!!getToken());
  }, []);

  return <Home lang={lang} isLoggedIn={isLoggedIn} />;
}
