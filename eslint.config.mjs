import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // preset Next.js (core-web-vitals + TS)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ignora build dirs + 🔧 ignora le route di debug
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/app/debug/**",   // ← aggiunto
      "app/debug/**",       // ← aggiunto (per sicurezza)
    ],
    rules: {
      // Il client integra payload JSON legacy e SDK terzi non tipizzati.
      // Il controllo strutturale resta affidato a `tsc --noEmit`; gli `any`
      // espliciti vengono progressivamente sostituiti nei file modificati.
      "@typescript-eslint/no-explicit-any": "off",
      // Alcune immagini sono pixel di tracciamento, preview PWA o URL CMS
      // dinamici: next/image non è applicabile in modo uniforme.
      "@next/next/no-img-element": "off",
    },
  },

  // ✅ disabilita SOLO questa regola su quella pagina (se non venisse ignorata)
  {
    files: ["src/app/debug/api-test/page.tsx"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
