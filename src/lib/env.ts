// src/lib/env.ts
function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const ENV = {
  REVALIDATE_SECRET: required("REVALIDATE_SECRET"),
  API_BASE_URL: required("API_BASE_URL"), // se già usi il proxy Next, puoi lasciarlo opzionale
};
